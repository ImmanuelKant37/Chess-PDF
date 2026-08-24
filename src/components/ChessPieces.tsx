import React from 'react';
import { PieceSkinId } from '../types/adventure';

export interface PieceProps {
  className?: string;
  color: 'w' | 'b';
  skin?: PieceSkinId | string;
}

// =========================================================================
// 1. CLASSIC / NEO-STAUNTON PIECES
// =========================================================================
const ClassicPawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
        fill={isWhite ? '#FFFFFF' : '#1E293B'}
        stroke={isWhite ? '#1E293B' : '#0F172A'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {isWhite && <path d="M19 19c1.5-.5 5.5-.5 7 0" stroke="#CBD5E1" strokeWidth="1" />}
    </svg>
  );
};

const ClassicKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
        fill={isWhite ? '#FFFFFF' : '#1E293B'}
        stroke={isWhite ? '#1E293B' : '#0F172A'}
        strokeWidth="1.5"
      />
      <path
        d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.163-.997-.932-.82-1.92C11.5 25.5 13 21 16 17c1.5-2 3.5-5 5-7 0 0 2 0 3 8z"
        fill={isWhite ? '#FFFFFF' : '#1E293B'}
        stroke={isWhite ? '#1E293B' : '#0F172A'}
        strokeWidth="1.5"
      />
      <circle cx="9.5" cy="25.5" r="0.8" fill={isWhite ? '#1E293B' : '#FFFFFF'} />
      <path d="M15 15.5c.2 1.3-.8 2.5-2.2 2.5-1.4 0-2.4-1.2-2.2-2.5.2-1.3 1.5-2.5 2.8-2.5 1.4 0 1.4 1.2 1.6 2.5z" fill={isWhite ? '#1E293B' : '#FFFFFF'} />
    </svg>
  );
};

const ClassicBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#FFFFFF' : '#1E293B'} stroke={isWhite ? '#1E293B' : '#0F172A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
        <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
        <circle cx="22.5" cy="8" r="2.5" />
        <path d="M17.5 26h10M22.5 21v10M22.5 14v4M20.5 16h4" stroke={isWhite ? '#1E293B' : '#FFFFFF'} strokeWidth="1.5" />
      </g>
    </svg>
  );
};

const ClassicRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#FFFFFF' : '#1E293B'} stroke={isWhite ? '#1E293B' : '#0F172A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
        <path d="M34 14l-3 3H14l-3-3" />
        <path d="M31 17v12.5H14V17" />
        <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        <path d="M11 14h23" stroke={isWhite ? '#1E293B' : '#FFFFFF'} strokeWidth="1" />
      </g>
    </svg>
  );
};

const ClassicQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#FFFFFF' : '#1E293B'} stroke={isWhite ? '#1E293B' : '#0F172A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="12" r="2" />
        <circle cx="14" cy="8.5" r="2" />
        <circle cx="22.5" cy="7.5" r="2" />
        <circle cx="31" cy="8.5" r="2" />
        <circle cx="39" cy="12" r="2" />
        <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-4-14-4.5 14-4.5-14-4 14-7-11 2 12z" />
        <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
        <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke={isWhite ? '#1E293B' : '#FFFFFF'} strokeWidth="1.5" />
      </g>
    </svg>
  );
};

const ClassicKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={isWhite ? '#FFFFFF' : '#1E293B'} stroke={isWhite ? '#1E293B' : '#0F172A'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.5 11.63V6M20 8h5" stroke={isWhite ? '#1E293B' : '#FFFFFF'} strokeWidth="1.5" />
        <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
        <path d="M11.5 37c5.5 3.5 16.5 3.5 22 0v-3c0-3-4-4.5-4-4.5-3.5 3-10.5 3-14 0 0 0-4 1.5-4 4.5v3z" />
        <path d="M11.5 30c5.5-2 16.5-2 22 0m-22 3.5c5.5-2 16.5-2 22 0m-22 3.5c5.5-2 16.5-2 22 0" stroke={isWhite ? '#1E293B' : '#FFFFFF'} strokeWidth="1" />
      </g>
    </svg>
  );
};

// =========================================================================
// 2. MEDIEVAL FEUDAL PIECES (ENGRAVED IRON & GOLD CROWNS)
// =========================================================================
const MedievalPawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? "medPawnW" : "medPawnB"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isWhite ? "#FFFBEB" : "#334155"} />
          <stop offset="100%" stopColor={isWhite ? "#D97706" : "#0F172A"} />
        </linearGradient>
      </defs>
      {/* Kettle helmet & Heater shield body */}
      <path d="M22.5 8 C18 8 16 11 16 15 L29 15 C29 11 27 8 22.5 8 Z" fill={`url(#${isWhite ? "medPawnW" : "medPawnB"})`} stroke="#78350F" strokeWidth="1.5" />
      <path d="M14 16 L31 16 L29 27 C29 32 22.5 36 22.5 36 C22.5 36 16 32 16 27 Z" fill={`url(#${isWhite ? "medPawnW" : "medPawnB"})`} stroke={isWhite ? "#B45309" : "#1E293B"} strokeWidth="1.5" />
      <path d="M11 39 L34 39 L31 36 L14 36 Z" fill={isWhite ? "#F59E0B" : "#1E293B"} stroke="#78350F" strokeWidth="1.2" />
      {/* Fleur heraldic cross */}
      <path d="M22.5 20 L22.5 28 M19 23 L26 23" stroke={isWhite ? "#78350F" : "#FBBF24"} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const MedievalKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? "medKnightW" : "medKnightB"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isWhite ? "#FFFFFF" : "#475569"} />
          <stop offset="100%" stopColor={isWhite ? "#E2D4C0" : "#1E1B4B"} />
        </linearGradient>
      </defs>
      {/* Armored Warhorse with chainmail neck and helm crest */}
      <path d="M20 7 C28 7 35 13 36 24 C36 34 29 39 12 39 C12 33 16 28 17 22 C14 20 11 17 11 13 C14 11 17 9 20 7 Z" fill={`url(#${isWhite ? "medKnightW" : "medKnightB"})`} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.6" />
      <path d="M22 6 L26 11 L21 12 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
      <path d="M28 15 L32 20 L30 25 L25 21 Z" fill={isWhite ? "#FDE68A" : "#334155"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1" />
      <circle cx="15" cy="13" r="1.5" fill={isWhite ? "#78350F" : "#F59E0B"} />
      <path d="M12 39 L36 39 L34 36 L14 36 Z" fill={isWhite ? "#F59E0B" : "#1E293B"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

const MedievalBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gothic Mitre & Cleric Scepter */}
      <path d="M22.5 6 C17 12 14 18 14 27 C14 33 18 36 22.5 36 C27 36 31 33 31 27 C31 18 28 12 22.5 6 Z" fill={isWhite ? "#FFFBEB" : "#1E293B"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.5" />
      <circle cx="22.5" cy="6" r="2.2" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
      <path d="M22.5 12 L22.5 30 M18 19 L27 19" stroke={isWhite ? "#92400E" : "#FBBF24"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 39 L34 39 L31 36 L14 36 Z" fill={isWhite ? "#F59E0B" : "#1E293B"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

const MedievalRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stone Castle Keep Tower */}
      <path d="M12 9 L15 9 L15 13 L19 13 L19 9 L26 9 L26 13 L30 13 L30 9 L33 9 L31 17 L14 17 Z" fill={isWhite ? "#FEF3C7" : "#334155"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.5" />
      <path d="M15 17 L30 17 L28 35 L17 35 Z" fill={isWhite ? "#FFFBEB" : "#1E293B"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.5" />
      <path d="M20 22 L25 22 L25 28 L20 28 Z" fill={isWhite ? "#92400E" : "#F59E0B"} />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#F59E0B" : "#1E293B"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

const MedievalQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gothic Tiara & Royal Robe */}
      <path d="M10 16 L14 11 L18 16 L22.5 8 L27 16 L31 11 L35 16 L33 28 L12 28 Z" fill={isWhite ? "#FEF3C7" : "#1E293B"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.5" />
      <circle cx="22.5" cy="7" r="2" fill="#F59E0B" />
      <circle cx="14" cy="10" r="1.5" fill="#DC2626" />
      <circle cx="31" cy="10" r="1.5" fill="#DC2626" />
      <path d="M12 28 C12 33 16 36 22.5 36 C29 36 33 33 33 28 Z" fill={isWhite ? "#FDE68A" : "#334155"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.4" />
      <path d="M10 39 L35 39 L33 36 L12 36 Z" fill={isWhite ? "#F59E0B" : "#1E293B"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

const MedievalKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* High Imperial Crown with Spikes & Cross */}
      <path d="M22.5 5 L22.5 11 M19.5 8 L25.5 8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 18 L16 12 L22.5 16 L29 12 L34 18 L32 29 L13 29 Z" fill={isWhite ? "#FFFBEB" : "#1E293B"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.5" />
      <circle cx="16" cy="11" r="1.5" fill="#F59E0B" />
      <circle cx="29" cy="11" r="1.5" fill="#F59E0B" />
      <path d="M13 29 C13 34 17 37 22.5 37 C28 37 32 34 32 29 Z" fill={isWhite ? "#FDE68A" : "#334155"} stroke={isWhite ? "#92400E" : "#0F172A"} strokeWidth="1.5" />
      <path d="M10 40 L35 40 L33 37 L12 37 Z" fill={isWhite ? "#F59E0B" : "#1E293B"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

// =========================================================================
// 3. WAR / MILITARY TACTICAL PIECES (ARMOR & CROSSHAIRS)
// =========================================================================
const WarPawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tactical Combat Helmet & Vest */}
      <path d="M17 14 C17 10 20 8 22.5 8 C25 8 28 10 28 14 L29 18 L16 18 Z" fill={isWhite ? "#E2E8F0" : "#1E293B"} stroke={isWhite ? "#047857" : "#059669"} strokeWidth="1.5" />
      <rect x="18" y="15" width="9" height="2.5" rx="1" fill="#10B981" />
      <path d="M14 20 L31 20 L28 35 L17 35 Z" fill={isWhite ? "#A7F3D0" : "#064E3B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.5" />
      <line x1="22.5" y1="20" x2="22.5" y2="35" stroke="#10B981" strokeWidth="1.2" />
      <path d="M12 39 L33 39 L30 35 L15 35 Z" fill={isWhite ? "#059669" : "#022C22"} stroke="#10B981" strokeWidth="1.2" />
    </svg>
  );
};

const WarKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tactical Mech / Combat Tank Turret */}
      <path d="M13 14 L26 10 L34 16 L31 28 L15 30 Z" fill={isWhite ? "#E2E8F0" : "#1E293B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.5" />
      <path d="M26 10 L36 8 L37 12 L28 13 Z" fill="#10B981" stroke={isWhite ? "#047857" : "#059669"} strokeWidth="1" />
      <circle cx="21" cy="18" r="2.5" fill="#10B981" />
      <path d="M12 32 L33 32 L35 38 L10 38 Z" fill={isWhite ? "#059669" : "#064E3B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.4" />
      {/* Treads */}
      <line x1="14" y1="35" x2="31" y2="35" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2,2" />
    </svg>
  );
};

const WarBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tactical Sniper Scope & Radar Beacon */}
      <circle cx="22.5" cy="18" r="9" fill={isWhite ? "#E2E8F0" : "#1E293B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.6" />
      <circle cx="22.5" cy="18" r="5" fill="none" stroke="#10B981" strokeWidth="1" />
      <line x1="22.5" y1="6" x2="22.5" y2="30" stroke="#10B981" strokeWidth="1.2" />
      <line x1="10.5" y1="18" x2="34.5" y2="18" stroke="#10B981" strokeWidth="1.2" />
      <path d="M16 28 L29 28 L27 35 L18 35 Z" fill={isWhite ? "#A7F3D0" : "#064E3B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.2" />
      <path d="M12 39 L33 39 L29 35 L16 35 Z" fill={isWhite ? "#059669" : "#022C22"} stroke="#10B981" strokeWidth="1.2" />
    </svg>
  );
};

const WarRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Heavy Concrete Pillbox Bunker */}
      <path d="M11 12 L34 12 L32 20 L13 20 Z" fill={isWhite ? "#CBD5E1" : "#334155"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.5" />
      <rect x="15" y="15" width="15" height="3" fill="#0F172A" />
      <path d="M13 20 L32 20 L30 35 L15 35 Z" fill={isWhite ? "#E2E8F0" : "#1E293B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.5" />
      <path d="M10 39 L35 39 L32 35 L13 35 Z" fill={isWhite ? "#059669" : "#064E3B"} stroke="#10B981" strokeWidth="1.3" />
    </svg>
  );
};

const WarQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* General Officer Crest with Tactical Stars */}
      <path d="M12 18 L22.5 10 L33 18 L30 34 L15 34 Z" fill={isWhite ? "#E2E8F0" : "#1E293B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.5" />
      <circle cx="22.5" cy="8" r="2.5" fill="#FBBF24" />
      <circle cx="16" cy="14" r="1.8" fill="#FBBF24" />
      <circle cx="29" cy="14" r="1.8" fill="#FBBF24" />
      <rect x="18" y="24" width="9" height="4" rx="1" fill="#10B981" />
      <path d="M11 39 L34 39 L31 34 L14 34 Z" fill={isWhite ? "#059669" : "#022C22"} stroke="#10B981" strokeWidth="1.3" />
    </svg>
  );
};

const WarKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Supreme Field Marshal 5-Star Eagle Crest */}
      <path d="M22.5 5 L24 8 L27 8 L24.5 10 L25.5 13 L22.5 11 L19.5 13 L20.5 10 L18 8 L21 8 Z" fill="#FBBF24" />
      <path d="M12 16 L22.5 12 L33 16 L31 35 L14 35 Z" fill={isWhite ? "#E2E8F0" : "#1E293B"} stroke={isWhite ? "#047857" : "#10B981"} strokeWidth="1.6" />
      <path d="M18 20 L27 20 M18 25 L27 25 M18 30 L27 30" stroke="#10B981" strokeWidth="1.5" />
      <path d="M10 40 L35 40 L33 35 L12 35 Z" fill={isWhite ? "#059669" : "#064E3B"} stroke="#10B981" strokeWidth="1.4" />
    </svg>
  );
};

// =========================================================================
// 4. SPACE / SCI-FI COSMIC PIECES (ORBITAL & ENERGY CORES)
// =========================================================================
const SpacePawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orbital Probe with Levitation Ring */}
      <circle cx="22.5" cy="16" r="6" fill={isWhite ? "#E0E7FF" : "#1E1B4B"} stroke="#06B6D4" strokeWidth="1.5" />
      <circle cx="22.5" cy="16" r="2.5" fill="#38BDF8" />
      <ellipse cx="22.5" cy="28" rx="10" ry="3" fill="none" stroke="#818CF8" strokeWidth="1.2" strokeDasharray="3,2" />
      <path d="M17 33 L28 33 L30 38 L15 38 Z" fill={isWhite ? "#38BDF8" : "#312E81"} stroke="#06B6D4" strokeWidth="1.2" />
    </svg>
  );
};

const SpaceKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Delta Wing Starfighter */}
      <path d="M22.5 8 L32 28 L27 34 L22.5 30 L18 34 L13 28 Z" fill={isWhite ? "#EEF2FF" : "#1E1B4B"} stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M22.5 12 L26 24 L19 24 Z" fill="#06B6D4" />
      <circle cx="22.5" cy="20" r="1.5" fill="#FFFFFF" />
      <path d="M12 39 L33 39 L29 35 L16 35 Z" fill={isWhite ? "#4F46E5" : "#312E81"} stroke="#06B6D4" strokeWidth="1.2" />
    </svg>
  );
};

const SpaceBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Quantum Laser Beacon Spire */}
      <polygon points="22.5,6 30,28 15,28" fill={isWhite ? "#E0E7FF" : "#1E1B4B"} stroke="#C084FC" strokeWidth="1.5" />
      <circle cx="22.5" cy="18" r="3" fill="#A855F7" />
      <line x1="22.5" y1="4" x2="22.5" y2="10" stroke="#E879F9" strokeWidth="2" />
      <path d="M14 38 L31 38 L28 32 L17 32 Z" fill={isWhite ? "#6366F1" : "#312E81"} stroke="#C084FC" strokeWidth="1.2" />
    </svg>
  );
};

const SpaceRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Quantum Warp Citadel */}
      <path d="M13 10 L32 10 L30 33 L15 33 Z" fill={isWhite ? "#E0E7FF" : "#1E1B4B"} stroke="#06B6D4" strokeWidth="1.5" />
      <rect x="18" y="14" width="9" height="12" rx="2" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
      <line x1="22.5" y1="14" x2="22.5" y2="26" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M11 39 L34 39 L31 34 L14 34 Z" fill={isWhite ? "#0284C7" : "#0F172A"} stroke="#06B6D4" strokeWidth="1.3" />
    </svg>
  );
};

const SpaceQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Nebula Empress with Levitating Quantum Orbits */}
      <circle cx="22.5" cy="8" r="3.5" fill="#E879F9" stroke="#FFFFFF" strokeWidth="1" />
      <ellipse cx="22.5" cy="8" rx="7" ry="2" fill="none" stroke="#C084FC" strokeWidth="1" />
      <path d="M14 18 L22.5 12 L31 18 L28 34 L17 34 Z" fill={isWhite ? "#EDE9FE" : "#1E1B4B"} stroke="#A855F7" strokeWidth="1.5" />
      <circle cx="22.5" cy="24" r="3" fill="#06B6D4" />
      <path d="M12 39 L33 39 L30 35 L15 35 Z" fill={isWhite ? "#9333EA" : "#3B0764"} stroke="#C084FC" strokeWidth="1.3" />
    </svg>
  );
};

const SpaceKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stellar Sovereign Dyson Nexus */}
      <circle cx="22.5" cy="8" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.2" />
      <path d="M22.5 2 L22.5 6 M18 8 L27 8" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M13 18 L22.5 14 L32 18 L29 35 L16 35 Z" fill={isWhite ? "#E0E7FF" : "#1E1B4B"} stroke="#38BDF8" strokeWidth="1.6" />
      <circle cx="22.5" cy="26" r="4" fill="#6366F1" stroke="#06B6D4" strokeWidth="1" />
      <path d="M11 40 L34 40 L31 36 L14 36 Z" fill={isWhite ? "#4338CA" : "#1E1B4B"} stroke="#38BDF8" strokeWidth="1.4" />
    </svg>
  );
};

// =========================================================================
// 5. ZOMBIE / BIOHAZARD WASTELAND PIECES (MUTATIONS & ACID)
// =========================================================================
const ZombiePawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mutant Toxic Skull */}
      <path d="M18 10 C18 7 27 7 27 10 C27 15 29 17 29 22 C29 28 26 31 22.5 31 C19 31 16 28 16 22 C16 17 18 15 18 10 Z" fill={isWhite ? "#ECFCCB" : "#1C1917"} stroke="#84CC16" strokeWidth="1.5" />
      <circle cx="20" cy="18" r="1.5" fill="#84CC16" />
      <circle cx="25" cy="18" r="1.5" fill="#84CC16" />
      <path d="M20 25 L25 25" stroke="#84CC16" strokeWidth="1.2" strokeDasharray="1,1" />
      <path d="M14 38 L31 38 L28 32 L17 32 Z" fill={isWhite ? "#65A30D" : "#365314"} stroke="#84CC16" strokeWidth="1.2" />
    </svg>
  );
};

const ZombieKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Infected Stalker Hound */}
      <path d="M14 12 C18 8 26 8 32 16 C34 22 30 30 16 32 C12 28 10 20 14 12 Z" fill={isWhite ? "#ECFCCB" : "#1C1917"} stroke="#84CC16" strokeWidth="1.6" />
      <circle cx="20" cy="16" r="2" fill="#EF4444" />
      <path d="M28 20 L33 24 L27 24 Z" fill="#84CC16" />
      <path d="M12 38 L33 38 L30 33 L15 33 Z" fill={isWhite ? "#4D7C0F" : "#365314"} stroke="#84CC16" strokeWidth="1.3" />
    </svg>
  );
};

const ZombieBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Toxic Flask & Biohazard Mask */}
      <circle cx="22.5" cy="10" r="4" fill="#84CC16" />
      <path d="M16 18 L29 18 L31 32 L14 32 Z" fill={isWhite ? "#ECFCCB" : "#1C1917"} stroke="#84CC16" strokeWidth="1.5" />
      <circle cx="22.5" cy="24" r="3.5" fill="#EF4444" opacity="0.8" />
      <path d="M12 39 L33 39 L30 34 L15 34 Z" fill={isWhite ? "#4D7C0F" : "#1A2E05"} stroke="#84CC16" strokeWidth="1.2" />
    </svg>
  );
};

const ZombieRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Spiked Scrap Metal Bastion */}
      <path d="M12 12 L16 8 L20 12 L25 8 L29 12 L33 8 L31 33 L14 33 Z" fill={isWhite ? "#D9F99D" : "#1C1917"} stroke="#84CC16" strokeWidth="1.5" />
      <line x1="16" y1="20" x2="29" y2="20" stroke="#84CC16" strokeWidth="1.2" />
      <path d="M11 39 L34 39 L31 34 L14 34 Z" fill={isWhite ? "#4D7C0F" : "#365314"} stroke="#84CC16" strokeWidth="1.3" />
    </svg>
  );
};

const ZombieQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Broodmother Mutated Matriarch */}
      <circle cx="22.5" cy="8" r="3" fill="#EF4444" />
      <path d="M11 16 L22.5 10 L34 16 L31 34 L14 34 Z" fill={isWhite ? "#ECFCCB" : "#1C1917"} stroke="#84CC16" strokeWidth="1.5" />
      <circle cx="17" cy="22" r="2" fill="#84CC16" />
      <circle cx="28" cy="22" r="2" fill="#84CC16" />
      <circle cx="22.5" cy="26" r="2.5" fill="#EF4444" />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#4D7C0F" : "#14532D"} stroke="#84CC16" strokeWidth="1.3" />
    </svg>
  );
};

const ZombieKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lich Overlord Skull Crown */}
      <path d="M22.5 4 L22.5 9 M19 7 L26 7" stroke="#EF4444" strokeWidth="2" />
      <path d="M12 16 L22.5 12 L33 16 L31 35 L14 35 Z" fill={isWhite ? "#ECFCCB" : "#1C1917"} stroke="#84CC16" strokeWidth="1.6" />
      <circle cx="18" cy="22" r="2.5" fill="#84CC16" />
      <circle cx="27" cy="22" r="2.5" fill="#84CC16" />
      <path d="M10 40 L35 40 L32 36 L13 36 Z" fill={isWhite ? "#65A30D" : "#365314"} stroke="#84CC16" strokeWidth="1.4" />
    </svg>
  );
};

// =========================================================================
// 6. CYBERPUNK / SYNTHWAVE PIECES (NEON CIRCUITS & HOLOGRAMS)
// =========================================================================
const CyberPawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cyber Android Head & Neon Visor */}
      <circle cx="22.5" cy="14" r="6" fill={isWhite ? "#ECFEFF" : "#0F172A"} stroke="#06B6D4" strokeWidth="1.5" />
      <rect x="18" y="12.5" width="9" height="3" fill="#D946EF" rx="1" />
      <path d="M16 22 L29 22 L27 34 L18 34 Z" fill={isWhite ? "#CFFAFE" : "#1E1B4B"} stroke="#D946EF" strokeWidth="1.4" />
      <path d="M13 38 L32 38 L29 34 L16 34 Z" fill={isWhite ? "#06B6D4" : "#831843"} stroke="#06B6D4" strokeWidth="1.2" />
    </svg>
  );
};

const CyberKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cybernetic Neon Stallion */}
      <path d="M18 10 L28 8 L34 16 L29 26 L15 28 Z" fill={isWhite ? "#ECFEFF" : "#0F172A"} stroke="#D946EF" strokeWidth="1.5" />
      <line x1="20" y1="14" x2="30" y2="18" stroke="#06B6D4" strokeWidth="2" />
      <path d="M13 32 L32 32 L34 38 L11 38 Z" fill={isWhite ? "#06B6D4" : "#831843"} stroke="#D946EF" strokeWidth="1.3" />
    </svg>
  );
};

const CyberBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hologram Laser Monolith */}
      <polygon points="22.5,6 31,26 14,26" fill={isWhite ? "#ECFEFF" : "#0F172A"} stroke="#06B6D4" strokeWidth="1.5" />
      <line x1="22.5" y1="10" x2="22.5" y2="24" stroke="#D946EF" strokeWidth="2" />
      <path d="M13 38 L32 38 L29 32 L16 32 Z" fill={isWhite ? "#06B6D4" : "#831843"} stroke="#06B6D4" strokeWidth="1.2" />
    </svg>
  );
};

const CyberRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neon Data Server Tower */}
      <path d="M13 10 L32 10 L30 33 L15 33 Z" fill={isWhite ? "#ECFEFF" : "#0F172A"} stroke="#D946EF" strokeWidth="1.5" />
      <line x1="17" y1="16" x2="28" y2="16" stroke="#06B6D4" strokeWidth="1.5" />
      <line x1="17" y1="22" x2="28" y2="22" stroke="#D946EF" strokeWidth="1.5" />
      <line x1="17" y1="28" x2="28" y2="28" stroke="#06B6D4" strokeWidth="1.5" />
      <path d="M11 39 L34 39 L31 34 L14 34 Z" fill={isWhite ? "#06B6D4" : "#831843"} stroke="#D946EF" strokeWidth="1.3" />
    </svg>
  );
};

const CyberQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Matrix AI Archon with Neon Hologram Crown */}
      <circle cx="22.5" cy="8" r="3.5" fill="#D946EF" stroke="#06B6D4" strokeWidth="1.5" />
      <path d="M12 18 L22.5 12 L33 18 L30 34 L15 34 Z" fill={isWhite ? "#ECFEFF" : "#0F172A"} stroke="#06B6D4" strokeWidth="1.5" />
      <rect x="18" y="22" width="9" height="4" fill="#D946EF" />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#06B6D4" : "#831843"} stroke="#D946EF" strokeWidth="1.3" />
    </svg>
  );
};

const CyberKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Root Kernel CPU Matrix Sovereign */}
      <path d="M22.5 4 L22.5 9 M19 6.5 L26 6.5" stroke="#D946EF" strokeWidth="2" />
      <path d="M12 16 L22.5 12 L33 16 L31 35 L14 35 Z" fill={isWhite ? "#ECFEFF" : "#0F172A"} stroke="#06B6D4" strokeWidth="1.6" />
      <circle cx="22.5" cy="24" r="4" fill="#D946EF" stroke="#06B6D4" strokeWidth="1" />
      <path d="M10 40 L35 40 L32 36 L13 36 Z" fill={isWhite ? "#06B6D4" : "#831843"} stroke="#06B6D4" strokeWidth="1.4" />
    </svg>
  );
};

// =========================================================================
// 7. ANIMALS / TOTEMIC NATURE PIECES (SPIRITS & BEASTS)
// =========================================================================
const AnimalPawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Forest Wolf Pup Totem */}
      <path d="M17 12 L20 7 L23 12 L26 7 L29 12 C29 18 26 24 22.5 24 C19 24 16 18 16 12 Z" fill={isWhite ? "#DCFCE7" : "#14532D"} stroke="#059669" strokeWidth="1.5" />
      <circle cx="20" cy="15" r="1.5" fill={isWhite ? "#14532D" : "#86EFAC"} />
      <circle cx="25" cy="15" r="1.5" fill={isWhite ? "#14532D" : "#86EFAC"} />
      <path d="M16 24 L29 24 L27 34 L18 34 Z" fill={isWhite ? "#BBF7D0" : "#064E3B"} stroke="#059669" strokeWidth="1.3" />
      <path d="M13 38 L32 38 L29 34 L16 34 Z" fill={isWhite ? "#10B981" : "#022C22"} stroke="#059669" strokeWidth="1.2" />
    </svg>
  );
};

const AnimalKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Black Panther / Wild Stallion */}
      <path d="M18 9 C26 7 34 14 34 24 C34 32 28 35 14 34 C12 28 14 20 18 9 Z" fill={isWhite ? "#DCFCE7" : "#064E3B"} stroke="#10B981" strokeWidth="1.5" />
      <circle cx="23" cy="16" r="2" fill="#F59E0B" />
      <path d="M12 38 L33 38 L31 34 L14 34 Z" fill={isWhite ? "#10B981" : "#022C22"} stroke="#10B981" strokeWidth="1.2" />
    </svg>
  );
};

const AnimalBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mystic Eagle / Forest Owl */}
      <circle cx="22.5" cy="12" r="6" fill={isWhite ? "#DCFCE7" : "#064E3B"} stroke="#10B981" strokeWidth="1.5" />
      <circle cx="20" cy="12" r="1.5" fill="#F59E0B" />
      <circle cx="25" cy="12" r="1.5" fill="#F59E0B" />
      <polygon points="22.5,15 21,17 24,17" fill="#F59E0B" />
      <path d="M14 22 L31 22 L28 34 L17 34 Z" fill={isWhite ? "#BBF7D0" : "#14532D"} stroke="#10B981" strokeWidth="1.4" />
      <path d="M12 39 L33 39 L30 35 L15 35 Z" fill={isWhite ? "#10B981" : "#022C22"} stroke="#10B981" strokeWidth="1.2" />
    </svg>
  );
};

const AnimalRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ancient Sacred Oak Monolith */}
      <path d="M14 12 Q22.5 6 31 12 L29 34 L16 34 Z" fill={isWhite ? "#DCFCE7" : "#064E3B"} stroke="#10B981" strokeWidth="1.5" />
      <path d="M18 18 Q22.5 14 27 18 M18 24 Q22.5 20 27 24 M18 30 Q22.5 26 27 30" stroke="#059669" strokeWidth="1.2" />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#10B981" : "#022C22"} stroke="#10B981" strokeWidth="1.3" />
    </svg>
  );
};

const AnimalQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Apex Spirit Lioness */}
      <circle cx="22.5" cy="8" r="3" fill="#F59E0B" />
      <path d="M12 18 L22.5 12 L33 18 L30 34 L15 34 Z" fill={isWhite ? "#DCFCE7" : "#064E3B"} stroke="#10B981" strokeWidth="1.5" />
      <circle cx="18" cy="22" r="2" fill="#F59E0B" />
      <circle cx="27" cy="22" r="2" fill="#F59E0B" />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#10B981" : "#022C22"} stroke="#10B981" strokeWidth="1.3" />
    </svg>
  );
};

const AnimalKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Great Lion King with Majestic Mane */}
      <path d="M22.5 4 L22.5 8 M19.5 6 L25.5 6" stroke="#F59E0B" strokeWidth="2" />
      <path d="M11 16 L22.5 10 L34 16 C34 26 28 35 22.5 35 C17 35 11 26 11 16 Z" fill={isWhite ? "#DCFCE7" : "#064E3B"} stroke="#F59E0B" strokeWidth="1.6" />
      <circle cx="18" cy="18" r="2" fill="#F59E0B" />
      <circle cx="27" cy="18" r="2" fill="#F59E0B" />
      <polygon points="22.5,22 20.5,25 24.5,25" fill="#F59E0B" />
      <path d="M10 40 L35 40 L32 36 L13 36 Z" fill={isWhite ? "#059669" : "#022C22"} stroke="#F59E0B" strokeWidth="1.4" />
    </svg>
  );
};

// =========================================================================
// 8. GOLD / 24K IMPERIAL LUXURY PIECES (POLISHED GOLD & RUBIES)
// =========================================================================
const GoldPawn: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? "goldPawnW" : "goldPawnB"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isWhite ? "#FEF08A" : "#78350F"} />
          <stop offset="50%" stopColor={isWhite ? "#FACC15" : "#451A03"} />
          <stop offset="100%" stopColor={isWhite ? "#CA8A04" : "#1C1917"} />
        </linearGradient>
      </defs>
      <circle cx="22.5" cy="13" r="5.5" fill={`url(#${isWhite ? "goldPawnW" : "goldPawnB"})`} stroke="#78350F" strokeWidth="1.5" />
      <circle cx="22.5" cy="13" r="1.8" fill="#EF4444" />
      <path d="M16 21 L29 21 L27 34 L18 34 Z" fill={`url(#${isWhite ? "goldPawnW" : "goldPawnB"})`} stroke="#78350F" strokeWidth="1.5" />
      <path d="M13 38 L32 38 L29 34 L16 34 Z" fill={isWhite ? "#EAB308" : "#451A03"} stroke="#78350F" strokeWidth="1.3" />
    </svg>
  );
};

const GoldKnight: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={isWhite ? "goldKnW" : "goldKnB"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={isWhite ? "#FEF08A" : "#78350F"} />
          <stop offset="100%" stopColor={isWhite ? "#CA8A04" : "#1C1917"} />
        </linearGradient>
      </defs>
      <path d="M22 8 C30 8 36 14 36 24 C36 34 29 38 14 38 C14 32 17 26 18 20 C15 18 12 15 12 12 C15 10 18 8 22 8 Z" fill={`url(#${isWhite ? "goldKnW" : "goldKnB"})`} stroke="#78350F" strokeWidth="1.6" />
      <circle cx="16" cy="13" r="1.8" fill="#EF4444" />
      <path d="M12 39 L35 39 L33 35 L14 35 Z" fill={isWhite ? "#EAB308" : "#451A03"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

const GoldBishop: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22.5" cy="8" r="2.5" fill="#EF4444" stroke="#78350F" strokeWidth="1" />
      <path d="M15 14 C15 10 30 10 30 14 L28 34 L17 34 Z" fill={isWhite ? "#FEF08A" : "#78350F"} stroke="#78350F" strokeWidth="1.5" />
      <circle cx="22.5" cy="22" r="3" fill="#EF4444" />
      <path d="M12 39 L33 39 L30 35 L15 35 Z" fill={isWhite ? "#EAB308" : "#451A03"} stroke="#78350F" strokeWidth="1.2" />
    </svg>
  );
};

const GoldRook: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10 L16 10 L16 14 L20 14 L20 10 L25 10 L25 14 L29 14 L29 10 L33 10 L31 34 L14 34 Z" fill={isWhite ? "#FEF08A" : "#78350F"} stroke="#78350F" strokeWidth="1.5" />
      <rect x="20" y="20" width="5" height="8" rx="2" fill="#EF4444" />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#EAB308" : "#451A03"} stroke="#78350F" strokeWidth="1.3" />
    </svg>
  );
};

const GoldQueen: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22.5" cy="7" r="2.5" fill="#EF4444" />
      <circle cx="14" cy="10" r="2" fill="#3B82F6" />
      <circle cx="31" cy="10" r="2" fill="#3B82F6" />
      <path d="M11 16 L15 11 L19 16 L22.5 8 L26 16 L30 11 L34 16 L31 34 L14 34 Z" fill={isWhite ? "#FEF08A" : "#78350F"} stroke="#78350F" strokeWidth="1.5" />
      <rect x="18" y="24" width="9" height="4" rx="2" fill="#EF4444" />
      <path d="M11 39 L34 39 L31 35 L14 35 Z" fill={isWhite ? "#EAB308" : "#451A03"} stroke="#78350F" strokeWidth="1.3" />
    </svg>
  );
};

const GoldKing: React.FC<{ color: 'w' | 'b'; className?: string }> = ({ color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  return (
    <svg viewBox="0 0 45 45" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.5 4 L22.5 10 M19 7 L26 7" stroke="#EF4444" strokeWidth="2.2" />
      <path d="M11 16 L22.5 11 L34 16 L31 35 L14 35 Z" fill={isWhite ? "#FEF08A" : "#78350F"} stroke="#78350F" strokeWidth="1.6" />
      <circle cx="17" cy="20" r="2" fill="#3B82F6" />
      <circle cx="22.5" cy="24" r="3" fill="#EF4444" />
      <circle cx="28" cy="20" r="2" fill="#3B82F6" />
      <path d="M10 40 L35 40 L32 36 L13 36 Z" fill={isWhite ? "#EAB308" : "#451A03"} stroke="#78350F" strokeWidth="1.4" />
    </svg>
  );
};

// =========================================================================
// MAIN DISPATCHER COMPONENT
// =========================================================================
export const ChessPieceIcon: React.FC<{
  type: string;
  color: 'w' | 'b';
  skin?: PieceSkinId | string;
  className?: string;
}> = ({ type, color, skin = 'classic', className = 'w-full h-full' }) => {
  const normalizedType = type.toLowerCase();

  switch (skin) {
    case 'medieval':
      switch (normalizedType) {
        case 'p': return <MedievalPawn color={color} className={className} />;
        case 'n': return <MedievalKnight color={color} className={className} />;
        case 'b': return <MedievalBishop color={color} className={className} />;
        case 'r': return <MedievalRook color={color} className={className} />;
        case 'q': return <MedievalQueen color={color} className={className} />;
        case 'k': return <MedievalKing color={color} className={className} />;
      }
      break;

    case 'war':
      switch (normalizedType) {
        case 'p': return <WarPawn color={color} className={className} />;
        case 'n': return <WarKnight color={color} className={className} />;
        case 'b': return <WarBishop color={color} className={className} />;
        case 'r': return <WarRook color={color} className={className} />;
        case 'q': return <WarQueen color={color} className={className} />;
        case 'k': return <WarKing color={color} className={className} />;
      }
      break;

    case 'space':
      switch (normalizedType) {
        case 'p': return <SpacePawn color={color} className={className} />;
        case 'n': return <SpaceKnight color={color} className={className} />;
        case 'b': return <SpaceBishop color={color} className={className} />;
        case 'r': return <SpaceRook color={color} className={className} />;
        case 'q': return <SpaceQueen color={color} className={className} />;
        case 'k': return <SpaceKing color={color} className={className} />;
      }
      break;

    case 'zombie':
      switch (normalizedType) {
        case 'p': return <ZombiePawn color={color} className={className} />;
        case 'n': return <ZombieKnight color={color} className={className} />;
        case 'b': return <ZombieBishop color={color} className={className} />;
        case 'r': return <ZombieRook color={color} className={className} />;
        case 'q': return <ZombieQueen color={color} className={className} />;
        case 'k': return <ZombieKing color={color} className={className} />;
      }
      break;

    case 'cyberpunk':
      switch (normalizedType) {
        case 'p': return <CyberPawn color={color} className={className} />;
        case 'n': return <CyberKnight color={color} className={className} />;
        case 'b': return <CyberBishop color={color} className={className} />;
        case 'r': return <CyberRook color={color} className={className} />;
        case 'q': return <CyberQueen color={color} className={className} />;
        case 'k': return <CyberKing color={color} className={className} />;
      }
      break;

    case 'animals':
      switch (normalizedType) {
        case 'p': return <AnimalPawn color={color} className={className} />;
        case 'n': return <AnimalKnight color={color} className={className} />;
        case 'b': return <AnimalBishop color={color} className={className} />;
        case 'r': return <AnimalRook color={color} className={className} />;
        case 'q': return <AnimalQueen color={color} className={className} />;
        case 'k': return <AnimalKing color={color} className={className} />;
      }
      break;

    case 'gold':
      switch (normalizedType) {
        case 'p': return <GoldPawn color={color} className={className} />;
        case 'n': return <GoldKnight color={color} className={className} />;
        case 'b': return <GoldBishop color={color} className={className} />;
        case 'r': return <GoldRook color={color} className={className} />;
        case 'q': return <GoldQueen color={color} className={className} />;
        case 'k': return <GoldKing color={color} className={className} />;
      }
      break;

    default: // classic
      switch (normalizedType) {
        case 'p': return <ClassicPawn color={color} className={className} />;
        case 'n': return <ClassicKnight color={color} className={className} />;
        case 'b': return <ClassicBishop color={color} className={className} />;
        case 'r': return <ClassicRook color={color} className={className} />;
        case 'q': return <ClassicQueen color={color} className={className} />;
        case 'k': return <ClassicKing color={color} className={className} />;
      }
  }

  return null;
};
