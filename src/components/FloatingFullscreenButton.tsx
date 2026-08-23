import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { chessAudio } from '../utils/chessAudio';

interface FloatingFullscreenButtonProps {
  className?: string;
}

export const FloatingFullscreenButton: React.FC<FloatingFullscreenButtonProps> = ({
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      chessAudio.playSelect();
      if (!isFullscreen) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
          await (docEl as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
        } else if ((docEl as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
          await (docEl as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
        } else if ((docEl as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
          await (docEl as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
          await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
        } else if ((document as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
          await (document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
        } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
          await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed or was denied:', err);
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex items-center ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-full mr-2.5 px-3 py-1.5 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-bold rounded-xl shadow-xl border border-slate-700/80 whitespace-nowrap pointer-events-none transition-all duration-150 flex items-center gap-1.5 animate-in fade-in zoom-in-95">
          <span>{isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}</span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 dark:bg-slate-700 px-1.5 py-0.5 rounded">
            {isFullscreen ? 'Esc' : 'F11'}
          </span>
        </div>
      )}

      {/* Floating Button */}
      <button
        id="floating-fullscreen-toggle-btn"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Activar pantalla completa'}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 border backdrop-blur-md ${
          isFullscreen
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/50 shadow-indigo-500/25 ring-2 ring-indigo-400/30'
            : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 shadow-slate-300/40 dark:shadow-slate-950/60 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        {isFullscreen ? (
          <Minimize2 className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <Maximize2 className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>
    </div>
  );
};
