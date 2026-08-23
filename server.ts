import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { Chess } from 'chess.js';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback heuristic evaluation & move generation
function analyzePositionLocally(fen: string) {
  try {
    const chess = new Chess(fen);
    const currentTurn = chess.turn();
    
    // Evaluate material
    let whiteMaterial = 0;
    let blackMaterial = 0;
    const pieceValues: Record<string, number> = { p: 1, n: 3, b: 3.2, r: 5, q: 9, k: 0 };
    
    chess.board().forEach(row => {
      row.forEach(square => {
        if (square) {
          const val = pieceValues[square.type] || 0;
          if (square.color === 'w') whiteMaterial += val;
          else blackMaterial += val;
        }
      });
    });

    const materialDiff = Number((whiteMaterial - blackMaterial).toFixed(1));

    // Get current legal moves
    const currentMoves = chess.moves({ verbose: true });

    // Generate White suggestions (if white to move, use legal moves; if black to move, flip turn in FEN copy to simulate white's candidate ideas)
    let whiteCandidateMoves: Array<{ san: string; from: string; to: string; score: number; title: string; justification: string; tacticalConcept: string }> = [];
    let blackCandidateMoves: Array<{ san: string; from: string; to: string; score: number; title: string; justification: string; tacticalConcept: string }> = [];

    // Helper to evaluate and rank moves
    const evaluateMovesForColor = (fenStr: string, color: 'w' | 'b') => {
      const fenTokens = fenStr.split(' ');
      fenTokens[1] = color;
      fenTokens[3] = '-'; // clear en-passant if switching color to avoid invalid FEN
      const simChess = new Chess(fenTokens.join(' '));
      const moves = simChess.moves({ verbose: true });

      const scored = moves.map(m => {
        let score = 0;
        let concept = 'Desarrollo y Posicionamiento';
        let reason = `Moviliza la pieza hacia la casilla ${m.to}, mejorando la influencia territorial.`;

        // Check if capture
        if (m.captured) {
          const capturedVal = pieceValues[m.captured] || 1;
          const pieceVal = pieceValues[m.piece] || 1;
          score += capturedVal * 2;
          concept = 'Ganancia de Material / Captura';
          reason = `Captura ${m.captured.toUpperCase()} en ${m.to}, ganando ventaja material o simplificando la posición.`;
        }

        // Check if delivers check
        const testChess = new Chess(simChess.fen());
        try {
          testChess.move(m.san);
          if (testChess.inCheck()) {
            score += 2.5;
            concept = 'Ataque Directo con Jaque';
            reason = `Coloca al rey rival bajo jaque inmediato forzando una respuesta defensiva restrictiva.`;
          }
          if (testChess.isCheckmate()) {
            score += 100;
            concept = 'Jaque Mate';
            reason = `¡Remate definitivo que termina la partida con jaque mate!`;
          }
        } catch {
          // ignore
        }

        // Center control bonus
        if (['d4', 'e4', 'd5', 'e5', 'c4', 'c5', 'f4', 'f5'].includes(m.to)) {
          score += 1;
        }

        // Castling bonus
        if (m.san === 'O-O' || m.san === 'O-O-O') {
          score += 2;
          concept = 'Seguridad del Rey y Conexión de Torres';
          reason = `Enroque fundamental que pone a resguardo al monarca y activa la torre hacia la columna central.`;
        }

        return {
          san: m.san,
          from: m.from,
          to: m.to,
          score,
          title: `Jugada ${m.san}`,
          justification: reason,
          tacticalConcept: concept,
        };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 3);
    };

    whiteCandidateMoves = evaluateMovesForColor(fen, 'w');
    blackCandidateMoves = evaluateMovesForColor(fen, 'b');

    let evalText = 'Posición igualada';
    if (materialDiff > 2) evalText = `Ventaja Blanca (+${materialDiff})`;
    else if (materialDiff < -2) evalText = `Ventaja Negra (${materialDiff})`;
    else if (materialDiff > 0.5) evalText = `Ligera ventaja Blanca (+${materialDiff})`;
    else if (materialDiff < -0.5) evalText = `Ligera ventaja Negra (${materialDiff})`;

    const inCheck = chess.inCheck();
    const isCheckmate = chess.isCheckmate();
    const isDraw = chess.isDraw();

    const tacticalAlerts: string[] = [];
    if (isCheckmate) tacticalAlerts.push('¡Posición de Jaque Mate!');
    else if (inCheck) tacticalAlerts.push(`¡El bando ${currentTurn === 'w' ? 'Blanco' : 'Negro'} está bajo jaque!`);
    if (isDraw) tacticalAlerts.push('Partida en tablas (empate).');

    return {
      evaluation: materialDiff,
      evaluationText: evalText,
      gameStage: chess.history().length < 12 ? 'Apertura' : chess.history().length < 32 ? 'Medio juego' : 'Final',
      turn: currentTurn,
      inCheck,
      isCheckmate,
      isDraw,
      whiteSuggestions: whiteCandidateMoves,
      blackSuggestions: blackCandidateMoves,
      generalAssessment: `Posición evaluada: ${evalText}. ${currentTurn === 'w' ? 'Turno de las Blancas' : 'Turno de las Negras'}. Las blancas buscan controlar el centro y presionar debilidades, mientras las negras contraatacan o consolidan su estructura.`,
      tacticalAlerts,
    };
  } catch (error) {
    console.error('Error in local analysis:', error);
    return null;
  }
}

// API endpoint to analyze current board position and get AI suggestions for BOTH sides
app.post('/api/chess/analyze', async (req, res) => {
  try {
    const { fen, history = [], currentTurn = 'w', lastMove = null } = req.body;
    if (!fen) {
      return res.status(400).json({ error: 'FEN string is required' });
    }

    const localAnalysis = analyzePositionLocally(fen);
    if (!localAnalysis) {
      return res.status(400).json({ error: 'Invalid FEN notation' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return local heuristic analysis if no Gemini API key configured
      return res.json({
        ...localAnalysis,
        aiPowered: false,
        note: 'Análisis heurístico local. Para explicaciones didácticas profundas con Gran Maestro IA, añade GEMINI_API_KEY en los secretos.',
      });
    }

    // Call Gemini 3.7 Flash for deep, didactic Grandmaster chess analysis
    const prompt = `
Eres un Gran Maestro de Ajedrez y entrenador de élite (FIDE Senior Trainer). Analiza la siguiente posición de ajedrez donde el jugador está entrenando jugando contra sí mismo.

Datos de la posición:
- FEN: "${fen}"
- Turno activo: ${currentTurn === 'w' ? 'BLANCAS' : 'NEGRAS'}
- Última jugada realizada: ${lastMove ? JSON.stringify(lastMove) : 'Ninguna (Inicio)'}
- Historial reciente de jugadas: ${history.slice(-8).join(', ') || 'Inicio de partida'}
- Candidatas heurísticas sugeridas:
  * Blancas: ${localAnalysis.whiteSuggestions.map(s => s.san).join(', ')}
  * Negras: ${localAnalysis.blackSuggestions.map(s => s.san).join(', ')}

Por favor, genera un análisis didáctico, riguroso y en español. Devuelve EXCLUSIVAMENTE un objeto JSON válido con la siguiente estructura exacta:
{
  "evaluationText": "string breve de evaluación (ej. '+1.5 Ligera ventaja blanca por mejor desarrollo')",
  "evaluationScore": number (valor numérico estimado, ej: +1.5 o -0.8),
  "gameStage": "Apertura" | "Medio juego" | "Final",
  "generalAssessment": "Explicación de 2 a 3 oraciones sobre el carácter de la posición, temas estratégicos clave y planes a seguir para ambos bandos.",
  "whiteSuggestions": [
    {
      "san": "jugada en notación SAN (ej. e4, Nf3, d4)",
      "title": "Nombre didáctico de la idea (ej. Ruptura central e4, Clavada sobre c6, Enroque corto)",
      "tacticalConcept": "Concepto táctico/estratégico (ej. Dominio del centro, Clavada, Ataque al flanco de rey, Peón aislado)",
      "justification": "Explicación didáctica clara de por qué esta jugada es fuerte para las blancas, qué amenaza y qué plan inicia.",
      "score": number
    }
  ],
  "blackSuggestions": [
    {
      "san": "jugada en notación SAN (ej. e5, c5, Nf6)",
      "title": "Nombre didáctico de la idea (ej. Contragolpe c5, Presión sobre e4, Desarrollo armónico)",
      "tacticalConcept": "Concepto táctico/estratégico (ej. Defensa activa, Ruptura temática, Alfil fuera de la cadena)",
      "justification": "Explicación didáctica clara de por qué esta jugada es fuerte para las negras, cómo neutraliza o contraataca.",
      "score": number
    }
  ],
  "tacticalAlerts": [
    "Alerta 1 sobre piezas en el aire, clavadas o posibles tenedores",
    "Alerta 2 sobre casillas débiles o amenazas inmediatas"
  ],
  "keyTakeaway": "Consejo didáctico clave para el estudiante en esta jugada específica."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.text || '{}');
    } catch {
      jsonResponse = null;
    }

    if (jsonResponse && jsonResponse.whiteSuggestions && jsonResponse.blackSuggestions) {
      // Map coordinates for suggestions
      const chess = new Chess(fen);
      const enrichWithCoords = (list: any[], color: 'w' | 'b') => {
        const fenTokens = fen.split(' ');
        fenTokens[1] = color;
        fenTokens[3] = '-';
        const sim = new Chess(fenTokens.join(' '));
        const legalMoves = sim.moves({ verbose: true });

        return list.slice(0, 3).map((item: any) => {
          const match = legalMoves.find(m => m.san === item.san || m.san.replace('+', '') === item.san.replace('+', ''));
          return {
            ...item,
            from: match?.from || '',
            to: match?.to || '',
          };
        });
      };

      const enrichedWhite = enrichWithCoords(jsonResponse.whiteSuggestions, 'w');
      const enrichedBlack = enrichWithCoords(jsonResponse.blackSuggestions, 'b');

      return res.json({
        ...localAnalysis,
        ...jsonResponse,
        whiteSuggestions: enrichedWhite.length > 0 ? enrichedWhite : localAnalysis.whiteSuggestions,
        blackSuggestions: enrichedBlack.length > 0 ? enrichedBlack : localAnalysis.blackSuggestions,
        aiPowered: true,
      });
    }

    // Fallback to local analysis
    return res.json({
      ...localAnalysis,
      aiPowered: false,
    });
  } catch (error: any) {
    console.error('Error analyzing position with Gemini:', error);
    // Graceful fallback to local analysis
    const { fen } = req.body;
    const local = fen ? analyzePositionLocally(fen) : null;
    return res.json({
      ...local,
      aiPowered: false,
      errorNotice: 'Análisis generado mediante motor heurístico local.',
    });
  }
});

// API endpoint to explain a specific Stockfish best move or candidate line with AI
app.post('/api/chess/explain-move', async (req, res) => {
  try {
    const { fen, moveSan, moveUci, scoreFormatted = '', pvSan = [], turn = 'w', rank = 1, history = [] } = req.body;
    if (!fen || !moveSan) {
      return res.status(400).json({ error: 'FEN and moveSan are required' });
    }

    const sideName = turn === 'w' ? 'Blancas' : 'Negras';
    const opponentSideName = turn === 'w' ? 'Negras' : 'Blancas';

    // Heuristic fallback explanation
    const generateLocalMoveExplanation = () => {
      let themes: string[] = ['Actividad de piezas'];
      let summary = `La jugada ${moveSan} es recomendada por el motor para maximizar la actividad y el control de casillas clave.`;
      let purpose = `Moviliza recursos hacia una posición más activa, mejorando la armonía entre piezas y preparando planes estratégicos en el centro o flanco.`;
      let opponent = `El bando ${opponentSideName} debe responder con precisión para no ceder iniciativa o ventaja material.`;
      let advice = `Evalúa siempre qué pieza del rival queda atacada o restringida tras realizar esta jugada.`;

      if (moveSan.includes('+')) {
        themes.push('Jaque directo', 'Ganancia de tiempo');
        summary = `¡Jaque inmediato con ${moveSan}! Fuerza una respuesta defensiva restrictiva del rey rival.`;
        purpose = `Obliga al rey rival a moverse o a interponer una pieza, desorganizando la coordinación enemiga.`;
      } else if (moveSan.includes('x')) {
        themes.push('Ganancia de material', 'Simplificación favorable');
        summary = `Captura ${moveSan}, eliminando una pieza enemiga y alterando la estructura táctica.`;
        purpose = `Busca ganar material neto o eliminar un defensor crucial de una casilla débil.`;
      } else if (moveSan === 'O-O' || moveSan === 'O-O-O') {
        themes.push('Seguridad del Rey', 'Activación de Torres');
        summary = `Enroque fundamental que pone a resguardo al monarca y conecta las torres.`;
        purpose = `Transición al medio juego con máxima seguridad del rey y preparación de columnas centrales.`;
      } else if (['e4', 'd4', 'e5', 'd5', 'c4', 'c5'].includes(moveSan)) {
        themes.push('Dominio del centro', 'Ocupación de espacio');
        summary = `Ruptura u ocupación central con ${moveSan}, reclamando casillas estratégicas.`;
        purpose = `Establece presencia en el corazón del tablero, abriendo diagonales para alfiles y dama.`;
      } else if (['Nf3', 'Nc3', 'Nf6', 'Nc6', 'Cf3', 'Cc3', 'Cf6', 'Cc6'].some(n => moveSan.startsWith(n))) {
        themes.push('Desarrollo de piezas menores', 'Presión central');
        summary = `Desarrollo activo de caballo con ${moveSan}, controlando casillas centrales vitales.`;
        purpose = `Acelera el desarrollo hacia casillas de máxima influencia y prepara el enroque.`;
      }

      return {
        moveSan,
        evaluation: scoreFormatted || '0.0',
        summary,
        strategicPurpose: purpose,
        tacticalThemes: themes,
        opponentResponses: opponent,
        keyAdvice: advice,
        aiPowered: false,
      };
    };

    const ai = getGeminiClient();
    if (!ai) {
      return res.json(generateLocalMoveExplanation());
    }

    // Call Gemini 3.7 Flash for deep, didactic Grandmaster explanation of the specific move
    const prompt = `
Eres un Gran Maestro de Ajedrez y entrenador FIDE Senior de élite. El estudiante está analizando una posición con el motor Stockfish y solicita una explicación pedagógica y detallada de por qué la jugada "${moveSan}" es la mejor opción (Rank #${rank}) evaluada en ${scoreFormatted || 'evaluación equilibrada'}.

Datos de la posición:
- FEN: "${fen}"
- Bando que juega: ${sideName} (${turn === 'w' ? 'Blancas' : 'Negras'})
- Jugada analizada: ${moveSan} (UCI: ${moveUci || 'N/A'})
- Línea principal calculada por el motor (PV): ${pvSan.slice(0, 7).join(' ') || moveSan}
- Evaluación del motor: ${scoreFormatted}
- Historial reciente: ${history.slice(-6).join(', ') || 'Apertura'}

Instrucciones:
Explica con maestría didáctica, claridad y entusiasmo por qué esta jugada es la más precisa según el motor. Menciona casillas, debilidades concretas y la lógica detrás de la variante calculada.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con la siguiente estructura exacta:
{
  "moveSan": "${moveSan}",
  "evaluation": "${scoreFormatted}",
  "summary": "Resumen conciso y directo (1 a 2 oraciones) de la idea principal y la amenaza directa.",
  "strategicPurpose": "Explicación profunda en 1 o 2 párrafos sobre el plan estratégico, coordinación de piezas, control de casillas clave y motivos tácticos de fondo.",
  "tacticalThemes": ["Tema 1 (ej: Clavada absoluta)", "Tema 2 (ej: Casilla fuerte d5)", "Tema 3 (ej: Ganancia de tiempo)"],
  "opponentResponses": "Análisis de cómo responderá el rival (${opponentSideName}) según la variante del motor y por qué las defensas naturales alternativas fallan o son peores.",
  "keyAdvice": "Consejo o regla de oro práctica de Gran Maestro para recordar este patrón en futuras partidas."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.35,
      },
    });

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.text || '{}');
    } catch {
      jsonResponse = null;
    }

    if (jsonResponse && jsonResponse.summary && jsonResponse.strategicPurpose) {
      return res.json({
        ...jsonResponse,
        moveSan,
        evaluation: scoreFormatted || jsonResponse.evaluation,
        aiPowered: true,
      });
    }

    return res.json(generateLocalMoveExplanation());
  } catch (error) {
    console.error('Error generating move explanation with Gemini:', error);
    // Return fallback
    const { moveSan, scoreFormatted = '' } = req.body;
    return res.json({
      moveSan: moveSan || 'Jugada',
      evaluation: scoreFormatted,
      summary: `La jugada ${moveSan} optimiza la actividad de las piezas según el cálculo táctico del motor.`,
      strategicPurpose: `Esta jugada mejora la posición armónica y presiona sobre puntos débiles del rival.`,
      tacticalThemes: ['Actividad de piezas', 'Cálculo del motor'],
      opponentResponses: `El oponente debe encontrar la defensa más tenaz indicada por el cálculo.`,
      keyAdvice: `Fíjate en las casillas clave que quedan bajo tu dominio tras esta jugada.`,
      aiPowered: false,
    });
  }
});

// API endpoint for interactive Grandmaster Coach questions
app.post('/api/chess/coach-chat', async (req, res) => {
  try {
    const { question, fen, history = [], currentTurn = 'w' } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        answer: 'Para chatear con el Gran Maestro de IA en tiempo real, configura la clave de API GEMINI_API_KEY en la configuración de la app.',
        aiPowered: false,
      });
    }

    const prompt = `
Eres un amigable, pedagógico y brillante Gran Maestro Internacional de Ajedrez que actúa como entrenador personal del estudiante.
El estudiante está practicando jugando contra sí mismo y te hace una pregunta sobre la posición actual.

Contexto actual:
- Posición FEN: "${fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}"
- Turno: ${currentTurn === 'w' ? 'BLANCAS' : 'NEGRAS'}
- Últimas jugadas: ${history.slice(-10).join(' ') || 'Inicio de partida'}

Pregunta del estudiante:
"${question}"

Instrucciones de respuesta:
1. Responde en un tono didáctico, entusiasta y claro en español.
2. Explica los motivos tácticos y estratégicos de forma concreta (mencionando casillas y piezas).
3. Da una recomendación práctica aplicable de inmediato.
4. Mantén la respuesta concisa (2 a 4 párrafos claros y con viñetas si es necesario).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return res.json({
      answer: response.text,
      aiPowered: true,
    });
  } catch (error) {
    console.error('Error in coach chat:', error);
    return res.status(500).json({ error: 'Error generating coach advice' });
  }
});

// Start Express Server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chess AI Coach server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
