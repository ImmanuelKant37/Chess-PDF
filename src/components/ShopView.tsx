import React, { useState } from 'react';
import {
  ShoppingBag,
  Coins,
  Sparkles,
  Shield,
  Check,
  Zap,
  Lock,
  Crown,
  ChevronRight,
  Flame,
  Star,
  Info,
  Gift,
  Heart,
  MessageSquare
} from 'lucide-react';
import {
  BoardThemeId,
  PieceSkinId,
  PetGrade,
  AdvisorPet,
  HeroState,
  ShopBoardItem,
  ShopPieceItem,
  ConsumableItem
} from '../types/adventure';
import {
  SHOP_BOARDS,
  SHOP_PIECES,
  ADVISOR_PETS,
  SHOP_CONSUMABLES
} from '../data/shopData';
import { ChessPieceIcon } from './ChessPieces';
import { soundSystem } from '../utils/chessAudio';

interface ShopViewProps {
  hero: HeroState;
  onUpdateHero: (updatedHero: HeroState) => void;
  onOpenAdventure?: () => void;
}

type ShopCategory = 'boards' | 'pieces' | 'pets' | 'consumables';

export const ShopView: React.FC<ShopViewProps> = ({
  hero,
  onUpdateHero,
  onOpenAdventure
}) => {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('pets');
  const [selectedPetPreview, setSelectedPetPreview] = useState<AdvisorPet | null>(() => {
    return ADVISOR_PETS.find(p => p.id === hero.equippedPet) || ADVISOR_PETS[0];
  });
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setPurchaseSuccess(msg);
    setTimeout(() => setPurchaseSuccess(null), 3000);
  };

  // Buy or Equip Board
  const handleBoardAction = (board: ShopBoardItem) => {
    const isOwned = hero.ownedBoards.includes(board.id);
    if (isOwned) {
      // Equip
      onUpdateHero({
        ...hero,
        equippedBoard: board.id
      });
      soundSystem.playSelect();
      showNotification(`¡Tablero "${board.name}" equipado con éxito!`);
      return;
    }

    // Buy
    if (hero.gold < board.price) {
      soundSystem.playWrong();
      showNotification('¡No tienes suficientes monedas de oro! Gana más en el Modo Aventura.');
      return;
    }

    onUpdateHero({
      ...hero,
      gold: hero.gold - board.price,
      ownedBoards: [...hero.ownedBoards, board.id],
      equippedBoard: board.id
    });
    soundSystem.playVictory();
    showNotification(`¡Compraste y equipaste el Tablero "${board.name}"!`);
  };

  // Buy or Equip Piece Skin
  const handlePieceAction = (piece: ShopPieceItem) => {
    const isOwned = hero.ownedPieceSkins.includes(piece.id);
    if (isOwned) {
      // Equip
      onUpdateHero({
        ...hero,
        equippedPieceSkin: piece.id
      });
      soundSystem.playSelect();
      showNotification(`¡Skin de piezas "${piece.name}" equipada!`);
      return;
    }

    // Buy
    if (hero.gold < piece.price) {
      soundSystem.playWrong();
      showNotification('¡Monedas de oro insuficientes! Completa zonas en Aventura.');
      return;
    }

    onUpdateHero({
      ...hero,
      gold: hero.gold - piece.price,
      ownedPieceSkins: [...hero.ownedPieceSkins, piece.id],
      equippedPieceSkin: piece.id
    });
    soundSystem.playVictory();
    showNotification(`¡Has desbloqueado el set "${piece.name}"!`);
  };

  // Buy or Equip Advisor Pet
  const handlePetAction = (pet: AdvisorPet) => {
    const isOwned = hero.ownedPets.includes(pet.id);
    if (isOwned) {
      // Equip
      onUpdateHero({
        ...hero,
        equippedPet: pet.id
      });
      soundSystem.playSelect();
      showNotification(`¡Mascota Consejera "${pet.name}" seleccionada para tus batallas!`);
      return;
    }

    // Buy
    if (hero.gold < pet.price) {
      soundSystem.playWrong();
      showNotification(`¡Necesitas ${pet.price} monedas para adoptar a ${pet.name}!`);
      return;
    }

    onUpdateHero({
      ...hero,
      gold: hero.gold - pet.price,
      ownedPets: [...hero.ownedPets, pet.id],
      equippedPet: pet.id
    });
    soundSystem.playVictory();
    showNotification(`¡Felicidades! Adoptaste a ${pet.name} (${pet.gradeLabel})`);
  };

  // Buy Consumable
  const handleBuyConsumable = (item: ConsumableItem) => {
    if (hero.gold < item.price) {
      soundSystem.playWrong();
      showNotification('¡Monedas insuficientes para comprar este consumible!');
      return;
    }

    const currentCount = hero.consumables[item.id] || 0;
    onUpdateHero({
      ...hero,
      gold: hero.gold - item.price,
      consumables: {
        ...hero.consumables,
        [item.id]: currentCount + 1
      }
    });
    soundSystem.playSelect();
    showNotification(`¡Compraste 1x ${item.name}!`);
  };

  // Grade color badges
  const getGradeBadgeStyle = (grade: PetGrade) => {
    switch (grade) {
      case 'bronze':
        return 'bg-amber-900/30 text-amber-300 border-amber-700/50';
      case 'silver':
        return 'bg-slate-300/20 text-slate-200 border-slate-400/50';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-xs shadow-yellow-500/20';
      case 'diamond':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-sm shadow-cyan-500/30';
      case 'mythic':
        return 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/50 shadow-md shadow-fuchsia-500/40 animate-pulse';
    }
  };

  const activeEquippedPet = ADVISOR_PETS.find(p => p.id === hero.equippedPet);

  return (
    <div className="w-full flex flex-col gap-4 max-w-7xl mx-auto">
      {/* Top Banner & Wallet */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-4 sm:p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-indigo-500/20">
              🛒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Bazar del Gran Maestro
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Tienda Real
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Gasta las monedas de oro ganadas en el <strong className="text-amber-300">Modo Aventura</strong> en tableros, skins y mascotas consejeras de alto grado.
              </p>
            </div>
          </div>

          {/* Wallet pill & quick adventure link */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 shadow-inner">
              <Coins className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-amber-300/80 leading-none">Tus Monedas</span>
                <span className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                  {hero.gold.toLocaleString()} <span className="text-xs font-normal">Oro</span>
                </span>
              </div>
            </div>

            {onOpenAdventure && (
              <button
                onClick={onOpenAdventure}
                className="px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <span>Ganar Oro</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Active equipped perks snapshot */}
        {activeEquippedPet && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Mascota Activa:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <span>{activeEquippedPet.icon}</span>
                <span>{activeEquippedPet.name}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getGradeBadgeStyle(activeEquippedPet.grade)}`}>
                {activeEquippedPet.gradeLabel}
              </span>
            </div>
            <div className="text-amber-300 font-semibold flex items-center gap-2">
              <span>✨ {activeEquippedPet.perkName}: {activeEquippedPet.perkDescription}</span>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {purchaseSuccess && (
        <div className="px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-bold flex items-center justify-between shadow-lg shadow-indigo-600/30 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{purchaseSuccess}</span>
          </div>
          <button onClick={() => setPurchaseSuccess(null)} className="text-white/80 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300/80 dark:border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCategory('pets')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeCategory === 'pets'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <span>🐾</span>
          <span>Mascotas Consejeras</span>
        </button>

        <button
          onClick={() => setActiveCategory('boards')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeCategory === 'boards'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <span>🏁</span>
          <span>Tableros de Mundos</span>
        </button>

        <button
          onClick={() => setActiveCategory('pieces')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeCategory === 'pieces'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <span>♔</span>
          <span>Skins de Piezas</span>
        </button>

        <button
          onClick={() => setActiveCategory('consumables')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeCategory === 'consumables'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-800'
          }`}
        >
          <span>🧪</span>
          <span>Pociones & Runa</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORY 1: MASCOTAS CONSEJERAS (ADVISOR PETS WITH GRADES) */}
      {/* ========================================================================= */}
      {activeCategory === 'pets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pet Cards List */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ADVISOR_PETS.map(pet => {
              const isOwned = hero.ownedPets.includes(pet.id);
              const isEquipped = hero.equippedPet === pet.id;
              const canAfford = hero.gold >= pet.price;

              return (
                <div
                  key={pet.id}
                  onClick={() => setSelectedPetPreview(pet)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isEquipped
                      ? 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/30'
                      : selectedPetPreview?.id === pet.id
                      ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-400 dark:border-slate-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={pet.avatar}
                          alt={pet.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute -bottom-1 -right-1 text-lg">
                          {pet.icon}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {pet.name}
                          </h3>
                        </div>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getGradeBadgeStyle(pet.grade)}`}>
                          {pet.gradeLabel}
                        </span>
                      </div>
                    </div>

                    {isEquipped && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Activo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {pet.description}
                  </p>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-[11px] flex flex-col gap-1">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{pet.perkName}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400">
                      {pet.perkDescription}
                    </span>
                  </div>

                  {/* Buy / Equip Button */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 font-black text-amber-500 dark:text-amber-400 text-sm">
                      <Coins className="w-4 h-4 fill-current" />
                      <span>{isOwned ? 'Adquirido' : `${pet.price} Oro`}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePetAction(pet);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                        isEquipped
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                          : isOwned
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                          : canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Equipado
                        </>
                      ) : isOwned ? (
                        <>Equipar</>
                      ) : (
                        <>Adoptar</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Pet Detail / Dialogue Box Preview */}
          {selectedPetPreview && (
            <div className="p-5 rounded-3xl bg-linear-to-b from-slate-900 to-indigo-950 text-white border border-indigo-500/30 flex flex-col justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedPetPreview.avatar}
                    alt={selectedPetPreview.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getGradeBadgeStyle(selectedPetPreview.grade)}`}>
                      {selectedPetPreview.gradeLabel}
                    </span>
                    <h2 className="text-base sm:text-lg font-black mt-1">
                      {selectedPetPreview.name}
                    </h2>
                    <p className="text-xs text-indigo-300 font-semibold">
                      Multiplicador: +{Math.round((selectedPetPreview.goldMultiplier - 1) * 100)}% Oro / +{Math.round((selectedPetPreview.xpMultiplier - 1) * 100)}% XP
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 mb-3">
                  <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Habilidad Especial: {selectedPetPreview.perkName}</span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    {selectedPetPreview.perkDescription}
                  </p>
                </div>

                {/* Didactic Dialogue Examples */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Consejos en Tiempo Real en Aventura:</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedPetPreview.didacticQuotes.map((quote, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 italic flex items-start gap-2"
                      >
                        <span className="text-sm shrink-0">{selectedPetPreview.icon}</span>
                        <span>"{quote}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => handlePetAction(selectedPetPreview)}
                className={`w-full py-3 rounded-2xl font-black text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                  hero.equippedPet === selectedPetPreview.id
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : hero.ownedPets.includes(selectedPetPreview.id)
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40'
                    : hero.gold >= selectedPetPreview.price
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/30 font-black'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                {hero.equippedPet === selectedPetPreview.id ? (
                  <>
                    <Check className="w-4 h-4" /> Mascota Activa en Batalla
                  </>
                ) : hero.ownedPets.includes(selectedPetPreview.id) ? (
                  <>Equipar como Mascota Consejera</>
                ) : (
                  <>Adoptar por {selectedPetPreview.price} Oro</>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 2: TABLEROS TEMÁTICOS DE MUNDOS */}
      {/* ========================================================================= */}
      {activeCategory === 'boards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_BOARDS.map(board => {
            const isOwned = hero.ownedBoards.includes(board.id);
            const isEquipped = hero.equippedBoard === board.id;
            const canAfford = hero.gold >= board.price;

            return (
              <div
                key={board.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
                  isEquipped
                    ? 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'
                }`}
              >
                <div>
                  {/* Swatch Preview of Board Tiles with Frame */}
                  <div className="w-full h-24 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-inner grid grid-cols-4 mb-3 p-1.5 bg-slate-950">
                    <div
                      className="h-full rounded-l-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: board.previewColors[0] }}
                    >
                      <ChessPieceIcon type="p" color="w" skin={board.id === 'wood' || board.id === 'green' || board.id === 'blue' ? 'classic' : board.id} className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div
                      className="h-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: board.previewColors[1] }}
                    >
                      <ChessPieceIcon type="n" color="b" skin={board.id === 'wood' || board.id === 'green' || board.id === 'blue' ? 'classic' : board.id} className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div
                      className="h-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: board.previewColors[0] }}
                    >
                      <ChessPieceIcon type="q" color="w" skin={board.id === 'wood' || board.id === 'green' || board.id === 'blue' ? 'classic' : board.id} className="w-8 h-8 drop-shadow-sm" />
                    </div>
                    <div
                      className="h-full rounded-r-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: board.previewColors[1] }}
                    >
                      <ChessPieceIcon type="k" color="b" skin={board.id === 'wood' || board.id === 'green' || board.id === 'blue' ? 'classic' : board.id} className="w-8 h-8 drop-shadow-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {board.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                      {board.styleTag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {board.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 font-black text-amber-500 dark:text-amber-400 text-sm">
                    <Coins className="w-4 h-4 fill-current" />
                    <span>{isOwned ? 'Adquirido' : board.price === 0 ? 'Gratis' : `${board.price} Oro`}</span>
                  </div>

                  <button
                    onClick={() => handleBoardAction(board)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      isEquipped
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                        : isOwned
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Equipado
                      </>
                    ) : isOwned ? (
                      <>Equipar</>
                    ) : (
                      <>Comprar</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 3: SKINS DE PIEZAS */}
      {/* ========================================================================= */}
      {activeCategory === 'pieces' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_PIECES.map(piece => {
            const isOwned = hero.ownedPieceSkins.includes(piece.id);
            const isEquipped = hero.equippedPieceSkin === piece.id;
            const canAfford = hero.gold >= piece.price;

            return (
              <div
                key={piece.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
                  isEquipped
                    ? 'bg-indigo-500/10 dark:bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50'
                }`}
              >
                <div>
                  {/* Live piece vector showcase */}
                  <div className="w-full h-20 rounded-2xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-around mb-3 shadow-inner">
                    <div className="w-11 h-11 p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                      <ChessPieceIcon type="p" color="w" skin={piece.id} className="w-full h-full" />
                    </div>
                    <div className="w-11 h-11 p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                      <ChessPieceIcon type="n" color="b" skin={piece.id} className="w-full h-full" />
                    </div>
                    <div className="w-11 h-11 p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                      <ChessPieceIcon type="q" color="w" skin={piece.id} className="w-full h-full" />
                    </div>
                    <div className="w-11 h-11 p-1 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center">
                      <ChessPieceIcon type="k" color="b" skin={piece.id} className="w-full h-full" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {piece.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                      {piece.styleTag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {piece.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 font-black text-amber-500 dark:text-amber-400 text-sm">
                    <Coins className="w-4 h-4 fill-current" />
                    <span>{isOwned ? 'Adquirido' : piece.price === 0 ? 'Gratis' : `${piece.price} Oro`}</span>
                  </div>

                  <button
                    onClick={() => handlePieceAction(piece)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      isEquipped
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-default'
                        : isOwned
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Equipado
                      </>
                    ) : isOwned ? (
                      <>Equipar</>
                    ) : (
                      <>Comprar</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 4: POCIONES & CONSUMIBLES */}
      {/* ========================================================================= */}
      {activeCategory === 'consumables' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SHOP_CONSUMABLES.map(item => {
            const count = hero.consumables[item.id] || 0;
            const canAfford = hero.gold >= item.price;

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4 shadow-sm hover:border-indigo-400/50 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      En inventario: <strong>{count}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 font-black text-amber-500 dark:text-amber-400 text-sm">
                    <Coins className="w-4 h-4 fill-current" />
                    <span>{item.price} Oro</span>
                  </div>

                  <button
                    onClick={() => handleBuyConsumable(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Comprar +1
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
