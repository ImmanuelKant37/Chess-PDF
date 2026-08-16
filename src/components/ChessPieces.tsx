import React from 'react';

// Crisp, high-contrast, beautiful vector chess piece icons (Standard Staunton Neo)
interface PieceProps {
  className?: string;
}

export const WhitePawn: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      fill="#FFFFFF"
      stroke="#1E293B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const BlackPawn: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const WhiteKnight: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
      fill="#FFFFFF"
      stroke="#1E293B"
      strokeWidth="1.5"
    />
    <path
      d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.163-.997-.932-.82-1.92C11.5 25.5 13 21 16 17c1.5-2 3.5-5 5-7 0 0 2 0 3 8z"
      fill="#FFFFFF"
      stroke="#1E293B"
      strokeWidth="1.5"
    />
    <path
      d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z"
      fill="#1E293B"
      stroke="#1E293B"
    />
    <path
      d="M15 15.5c.2 1.3-.8 2.5-2.2 2.5-1.4 0-2.4-1.2-2.2-2.5.2-1.3 1.5-2.5 2.8-2.5 1.4 0 1.4 1.2 1.6 2.5z"
      fill="#1E293B"
    />
  </svg>
);

export const BlackKnight: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="1.5"
    />
    <path
      d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.163-.997-.932-.82-1.92C11.5 25.5 13 21 16 17c1.5-2 3.5-5 5-7 0 0 2 0 3 8z"
      fill="#1E293B"
      stroke="#0F172A"
      strokeWidth="1.5"
    />
    <path
      d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
    />
    <path
      d="M15 15.5c.2 1.3-.8 2.5-2.2 2.5-1.4 0-2.4-1.2-2.2-2.5.2-1.3 1.5-2.5 2.8-2.5 1.4 0 1.4 1.2 1.6 2.5z"
      fill="#FFFFFF"
    />
  </svg>
);

export const WhiteBishop: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
      <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
      <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
      <path d="M17.5 26h10M22.5 21v10M22.5 14v4M20.5 16h4" stroke="#1E293B" strokeWidth="1.5" />
    </g>
  </svg>
);

export const BlackBishop: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
      <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
      <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
      <path d="M17.5 26h10M22.5 21v10M22.5 14v4M20.5 16h4" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>
  </svg>
);

export const WhiteRook: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
      <path d="M34 14l-3 3H14l-3-3" />
      <path d="M31 17v12.5H14V17" />
      <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
      <path d="M11 14h23" />
    </g>
  </svg>
);

export const BlackRook: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
      <path d="M34 14l-3 3H14l-3-3" />
      <path d="M31 17v12.5H14V17" />
      <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
      <path d="M11 14h23" stroke="#FFFFFF" strokeWidth="1" />
    </g>
  </svg>
);

export const WhiteQueen: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-4-14-4.5 14-4.5-14-4 14-7-11 2 12z" />
      <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
      <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#1E293B" strokeWidth="1.5" />
    </g>
  </svg>
);

export const BlackQueen: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
      <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-4-14-4.5 14-4.5-14-4 14-7-11 2 12z" />
      <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
      <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>
  </svg>
);

export const WhiteKing: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 11.63V6M20 8h5" stroke="#1E293B" strokeWidth="1.5" />
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
      <path d="M11.5 37c5.5 3.5 16.5 3.5 22 0v-3c0-3-4-4.5-4-4.5-3.5 3-10.5 3-14 0 0 0-4 1.5-4 4.5v3z" />
      <path d="M11.5 30c5.5-2 16.5-2 22 0m-22 3.5c5.5-2 16.5-2 22 0m-22 3.5c5.5-2 16.5-2 22 0" />
    </g>
  </svg>
);

export const BlackKing: React.FC<PieceProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.5 11.63V6M20 8h5" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
      <path d="M11.5 37c5.5 3.5 16.5 3.5 22 0v-3c0-3-4-4.5-4-4.5-3.5 3-10.5 3-14 0 0 0-4 1.5-4 4.5v3z" />
      <path d="M11.5 30c5.5-2 16.5-2 22 0m-22 3.5c5.5-2 16.5-2 22 0m-22 3.5c5.5-2 16.5-2 22 0" stroke="#FFFFFF" strokeWidth="1" />
    </g>
  </svg>
);

export const ChessPieceIcon: React.FC<{ type: string; color: 'w' | 'b'; className?: string }> = ({ type, color, className }) => {
  const pieceKey = `${color}${type.toUpperCase()}`;
  switch (pieceKey) {
    case 'wP': return <WhitePawn className={className} />;
    case 'bP': return <BlackPawn className={className} />;
    case 'wN': return <WhiteKnight className={className} />;
    case 'bN': return <BlackKnight className={className} />;
    case 'wB': return <WhiteBishop className={className} />;
    case 'bB': return <BlackBishop className={className} />;
    case 'wR': return <WhiteRook className={className} />;
    case 'bR': return <BlackRook className={className} />;
    case 'wQ': return <WhiteQueen className={className} />;
    case 'bQ': return <BlackQueen className={className} />;
    case 'wK': return <WhiteKing className={className} />;
    case 'bK': return <BlackKing className={className} />;
    default: return null;
  }
};
