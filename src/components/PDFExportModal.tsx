import React, { useState } from 'react';
import {
  X,
  FileDown,
  CheckSquare,
  Square,
  BookOpen,
  User,
  Settings,
  Sparkles,
  Layers
} from 'lucide-react';
import { Puzzle, PDFExportOptions } from '../types';
import { generateChessWorksheetPDF } from '../utils/pdfExport';

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzles: Puzzle[];
  defaultTitle?: string;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  puzzles,
  defaultTitle = 'Ajedrez Táctico - Cuaderno de Jaque Mate'
}) => {
  const [title, setTitle] = useState<string>(defaultTitle);
  const [studentName, setStudentName] = useState<string>('');
  const [includeSolutions, setIncludeSolutions] = useState<boolean>(true);
  const [solutionsOnSeparatePage, setSolutionsOnSeparatePage] = useState<boolean>(true);
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
  const [includeNotesBox, setIncludeNotesBox] = useState<boolean>(true);
  const [notationFormat, setNotationFormat] = useState<'spanish' | 'international' | 'figurine'>('spanish');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      const options: PDFExportOptions = {
        title,
        studentName,
        includeSolutions,
        solutionsOnSeparatePage,
        includeExplanations,
        includeStudentNotesBox: includeNotesBox,
        diagramsPerRow: 1,
        puzzles,
        notationFormat
      };
      generateChessWorksheetPDF(options);
      onClose();
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl w-full max-w-lg rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-950/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-xs">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Exportar Cuaderno Táctico en PDF
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {puzzles.length} ejercicios seleccionados con diagramas y soluciones
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Title input */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-1.5">
            <label className="font-black uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
              Título del Cuaderno / Documento:
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Ejercicios de Jaque Mate para Principiantes"
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Student Name */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-1.5">
            <label className="font-black uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
              Nombre del Alumno / Jugador (Opcional):
            </label>
            <input
              type="text"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Dejar en blanco para línea de escritura manuscrita"
              className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notation format */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-2">
            <label className="font-black uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
              Formato de Notación Algebraica:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'spanish', label: 'Español (D, T, A, C, R)' },
                { id: 'international', label: 'Internacional (Q, R, B, N, K)' },
                { id: 'figurine', label: 'Figuras (♛, ♜, ♝, ♞)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setNotationFormat(item.id as 'spanish' | 'international' | 'figurine')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                    notationFormat === item.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes for options */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-2.5">
            <label
              onClick={() => setIncludeSolutions(!includeSolutions)}
              className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 cursor-pointer font-bold select-none"
            >
              {includeSolutions ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>Incluir hoja de soluciones en notación algebraica (SAN)</span>
            </label>

            {includeSolutions && (
              <>
                <label
                  onClick={() => setSolutionsOnSeparatePage(!solutionsOnSeparatePage)}
                  className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 cursor-pointer font-semibold pl-6 select-none"
                >
                  {solutionsOnSeparatePage ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                  <span>Colocar soluciones en página separada al final (Ideal para exámenes)</span>
                </label>

                <label
                  onClick={() => setIncludeExplanations(!includeExplanations)}
                  className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 cursor-pointer font-semibold pl-6 select-none"
                >
                  {includeExplanations ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                  <span>Incluir explicación didáctica del motivo táctico en las soluciones</span>
                </label>
              </>
            )}

            <label
              onClick={() => setIncludeNotesBox(!includeNotesBox)}
              className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 cursor-pointer font-bold select-none"
            >
              {includeNotesBox ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>Incluir cuadro de notas y cálculo para el alumno</span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-xl transition"
          >
            Cancelar
          </button>

          <button
            id="download-pdf-confirm-btn"
            onClick={handleDownload}
            disabled={isGenerating || puzzles.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-black rounded-2xl shadow-xl shadow-blue-500/20 border border-blue-400/30 transition disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {isGenerating ? 'Generando PDF...' : `Descargar PDF (${puzzles.length} ejercicios)`}
          </button>
        </div>
      </div>
    </div>
  );
};
