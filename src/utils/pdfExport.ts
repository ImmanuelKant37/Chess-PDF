import { jsPDF } from 'jspdf';
import { Chess } from 'chess.js';
import { PDFExportOptions, Puzzle } from '../types';
import { convertSanToSpanish } from './notation';

// Draw an 8x8 chessboard diagram on jsPDF canvas
function drawChessboardDiagram(
  doc: jsPDF,
  fen: string,
  startX: number,
  startY: number,
  boardSize: number = 60
) {
  const squareSize = boardSize / 8;
  const chess = new Chess(fen);
  const board = chess.board();

  // Chess piece unicode symbols
  const pieceUnicode: Record<string, string> = {
    'wP': 'P',
    'bP': 'p',
    'wN': 'C',
    'bN': 'c',
    'wB': 'A',
    'bB': 'a',
    'wR': 'T',
    'bR': 't',
    'wQ': 'D',
    'bQ': 'd',
    'wK': 'R',
    'bK': 'r',
  };

  // Outer border
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(0.5);
  doc.rect(startX, startY, boardSize, boardSize);

  // Draw 64 squares
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      const x = startX + col * squareSize;
      const y = startY + row * squareSize;

      // Fill color
      if (isLight) {
        doc.setFillColor(245, 240, 230); // Warm ivory
      } else {
        doc.setFillColor(180, 150, 120); // Classic wooden brown
      }
      doc.rect(x, y, squareSize, squareSize, 'F');

      // Draw piece if present
      const piece = board[row][col];
      if (piece) {
        const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
        const isWhite = piece.color === 'w';

        // Draw piece badge background for high contrast
        doc.setFontSize(squareSize * 1.5);
        doc.setFont('helvetica', 'bold');

        if (isWhite) {
          doc.setTextColor(255, 255, 255);
          // Dark outline shadow
          doc.text(pieceUnicode[pieceKey] || '?', x + squareSize / 2, y + squareSize * 0.75, { align: 'center' });
          doc.setTextColor(20, 20, 20);
          doc.text(pieceUnicode[pieceKey] || '?', x + squareSize / 2, y + squareSize * 0.72, { align: 'center' });
        } else {
          doc.setTextColor(20, 20, 20);
          doc.text(pieceUnicode[pieceKey] || '?', x + squareSize / 2, y + squareSize * 0.74, { align: 'center' });
        }
      }
    }
  }

  // Draw File labels (a-h)
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  for (let c = 0; c < 8; c++) {
    const fileChar = String.fromCharCode('a'.charCodeAt(0) + c);
    doc.text(fileChar, startX + c * squareSize + squareSize / 2, startY + boardSize + 3, { align: 'center' });
  }

  // Draw Rank labels (1-8)
  for (let r = 0; r < 8; r++) {
    const rankNum = 8 - r;
    doc.text(String(rankNum), startX - 2.5, startY + r * squareSize + squareSize / 2 + 1.5, { align: 'right' });
  }
}

export function generateChessWorksheetPDF(options: PDFExportOptions): void {
  const {
    title,
    studentName,
    includeSolutions,
    solutionsOnSeparatePage,
    includeExplanations,
    includeStudentNotesBox,
    puzzles,
    notationFormat = 'spanish'
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  // Helper for Header
  const renderHeader = (pageTitle: string, subtitle: string) => {
    // Top banner
    doc.setFillColor(30, 41, 59); // Slate-800
    doc.rect(margin, currentY, contentWidth, 18, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(pageTitle, margin + 5, currentY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(subtitle, margin + 5, currentY + 13);

    // Student and Date box
    currentY += 22;
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, currentY, contentWidth, 12, 'FD');

    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text(`Estudiante:`, margin + 4, currentY + 7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(studentName || '_______________________________', margin + 24, currentY + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.text(`Fecha:`, margin + 115, currentY + 7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), margin + 128, currentY + 7.5);

    doc.setFont('helvetica', 'bold');
    doc.text(`Total Puzzles: ${puzzles.length}`, margin + 165, currentY + 7.5);

    currentY += 16;
  };

  // Render first page header
  renderHeader(
    title || 'Ajedrez Táctico - Cuaderno de Ejercicios',
    'Entrenamiento de Jaque Mate en 2, 3 y 4 jugadas para principiantes'
  );

  // Render Puzzles (2 per page or 4 per page depending on size)
  puzzles.forEach((puzzle, index) => {
    const itemHeight = 62;

    // Check if new page is needed
    if (currentY + itemHeight > pageHeight - margin - 15) {
      doc.addPage();
      currentY = margin;
      renderHeader(title || 'Ajedrez Táctico - Cuaderno de Ejercicios', `Hoja de Ejercicios (${index + 1} a ${puzzles.length})`);
    }

    const itemStartY = currentY;

    // Card border
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, itemStartY, contentWidth, itemHeight, 2, 2, 'FD');

    // Number tag badge
    doc.setFillColor(59, 130, 246); // Blue-500
    doc.roundedRect(margin + 3, itemStartY + 3, 14, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`#${index + 1}`, margin + 10, itemStartY + 7.2, { align: 'center' });

    // Puzzle Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text(puzzle.title, margin + 20, itemStartY + 7.5);

    // Turn indicator & Mate In
    const turnText = puzzle.turn === 'w' ? '⚪ Juegan Blancas' : '⚫ Juegan Negras';
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(puzzle.turn === 'w' ? 40 : 20, 40, 40);
    doc.text(`${turnText} | Mate en ${puzzle.mateIn} jugadas`, margin + 20, itemStartY + 12);

    // Theme tag
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Tema: ${puzzle.theme} | Dificultad: ${puzzle.difficulty}`, margin + 105, itemStartY + 12);

    // Chess Diagram
    const diagramSize = 42;
    drawChessboardDiagram(doc, puzzle.fen, margin + 6, itemStartY + 15, diagramSize);

    // Student solution write-in section
    const rightSectionX = margin + diagramSize + 16;
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Anota tu solución en Notación Algebraica:', rightSectionX, itemStartY + 20);

    // Lines for student handwriting
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);

    for (let m = 1; m <= puzzle.mateIn; m++) {
      const lineY = itemStartY + 23 + m * 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`${m}.`, rightSectionX, lineY + 1.5);
      
      // Blank line for white move
      doc.line(rightSectionX + 6, lineY + 2, rightSectionX + 45, lineY + 2);

      if (m < puzzle.mateIn || puzzle.solutionSan.length >= m * 2) {
        doc.text(`${m}...`, rightSectionX + 50, lineY + 1.5);
        // Blank line for black response
        doc.line(rightSectionX + 58, lineY + 2, rightSectionX + 95, lineY + 2);
      }
    }

    // Student notes / thoughts box
    if (includeStudentNotesBox) {
      const notesBoxY = itemStartY + 45;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text('Notas / Motivo táctico observado:', rightSectionX, notesBoxY);
      doc.rect(rightSectionX, notesBoxY + 1.5, contentWidth - diagramSize - 20, 11);
    }

    currentY += itemHeight + 5;
  });

  // Solutions Section
  if (includeSolutions) {
    if (solutionsOnSeparatePage || currentY + 50 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }

    // Solutions Header Banner
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.rect(margin, currentY, contentWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Hoja de Soluciones Oficiales y Análisis Táctico (SAN)', margin + 6, currentY + 8);
    currentY += 16;

    puzzles.forEach((puzzle, index) => {
      // Check if page overflow
      if (currentY + 25 > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, currentY, contentWidth, includeExplanations ? 22 : 14, 1.5, 1.5, 'FD');

      // Title & Number
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Ejercicio #${index + 1}: ${puzzle.title} (Mate en ${puzzle.mateIn})`, margin + 4, currentY + 5.5);

      // SAN sequence
      const sanMoves = puzzle.solutionSan.map(m => (notationFormat === 'spanish' ? convertSanToSpanish(m) : m));
      let moveSeqText = '';
      for (let i = 0; i < sanMoves.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        const wMove = sanMoves[i] || '';
        const bMove = sanMoves[i + 1] || '';
        moveSeqText += `${moveNum}. ${wMove} ${bMove}  `;
      }

      doc.setTextColor(14, 116, 144); // Cyan-700
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Solución: ${moveSeqText.trim()}`, margin + 4, currentY + 10.5);

      // Pedagogical explanation
      if (includeExplanations && puzzle.solutionExplanation && puzzle.solutionExplanation.length > 0) {
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        const explanationText = puzzle.solutionExplanation.join(' | ');
        const wrappedLines = doc.splitTextToSize(explanationText, contentWidth - 8);
        doc.text(wrappedLines, margin + 4, currentY + 15);
      }

      currentY += (includeExplanations ? 25 : 17);
    });
  }

  // Footer on all pages
  const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generado con Ajedrez Táctico - Plataforma de Aprendizaje y Entrenamiento de Jaque Mate | Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Download PDF
  const filename = `Ajedrez_Táctico_Ejercicios_Mate_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
