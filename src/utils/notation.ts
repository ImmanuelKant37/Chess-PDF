// Conversion between English standard SAN, Spanish algebraic notation, and Figurine notation

export function convertSanToSpanish(san: string): string {
  if (!san) return '';
  
  // Replace pieces in SAN:
  // K -> R (Rey)
  // Q -> D (Dama)
  // R -> T (Torre)
  // B -> A (Alfil)
  // N -> C (Caballo)
  
  let result = '';
  for (let i = 0; i < san.length; i++) {
    const char = san[i];
    // Only replace leading piece letters or promotion piece letters
    if (i === 0 || (i > 0 && san[i - 1] === '=')) {
      switch (char) {
        case 'K': result += 'R'; break;
        case 'Q': result += 'D'; break;
        case 'R': result += 'T'; break;
        case 'B': result += 'A'; break;
        case 'N': result += 'C'; break;
        default: result += char;
      }
    } else {
      // Handle disambiguations where piece letter might be followed by another letter or rank
      // Or in case of captures
      result += char;
    }
  }
  return result;
}

export function convertSanToFigurine(san: string, isWhitePiece = true): string {
  if (!san) return '';
  const whiteIcons: Record<string, string> = {
    'K': '♔',
    'Q': '♕',
    'R': '♖',
    'B': '♗',
    'N': '♘',
  };
  const blackIcons: Record<string, string> = {
    'K': '♚',
    'Q': '♛',
    'R': '♜',
    'B': '♝',
    'N': '♞',
  };
  const icons = isWhitePiece ? whiteIcons : blackIcons;

  let result = '';
  for (let i = 0; i < san.length; i++) {
    const char = san[i];
    if (i === 0 && icons[char]) {
      result += icons[char];
    } else if (i > 0 && san[i - 1] === '=' && icons[char]) {
      result += icons[char];
    } else {
      result += char;
    }
  }
  return result;
}

export function formatMoveSequence(sanMoves: string[], format: 'spanish' | 'international' | 'figurine' = 'spanish', startTurn: 'w' | 'b' = 'w'): string {
  const parts: string[] = [];
  let moveNumber = 1;
  let currentTurn = startTurn;

  sanMoves.forEach((san, index) => {
    let formattedSan = san;
    if (format === 'spanish') {
      formattedSan = convertSanToSpanish(san);
    } else if (format === 'figurine') {
      formattedSan = convertSanToFigurine(san, currentTurn === 'w');
    }

    if (currentTurn === 'w') {
      parts.push(`${moveNumber}. ${formattedSan}`);
      currentTurn = 'b';
    } else {
      if (index === 0) {
        parts.push(`${moveNumber}... ${formattedSan}`);
      } else {
        parts.push(formattedSan);
      }
      currentTurn = 'w';
      moveNumber++;
    }
  });

  return parts.join(' ');
}
