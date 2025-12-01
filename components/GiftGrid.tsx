import React, { useEffect, useState } from 'react';
import { loadGiftCounts, incrementGiftCount } from './giftUtils';

interface GiftGridProps {
  links: string[];
  startIndex?: number; // which index in links to start from
}

const GIFT_BOX_IMG = 'https://images.unsplash.com/photo-1606813902776-0a6ad9f1d8b7?q=80&w=400&auto=format&fit=crop';

const GiftGrid: React.FC<GiftGridProps> = ({ links, startIndex = 5 }) => {
  const items = links.slice(startIndex, startIndex + 5);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [counts, setCounts] = useState<number[]>(() => {
    try { return loadGiftCounts(); } catch { return new Array(10).fill(0); }
  });

  useEffect(() => {
    setCounts(loadGiftCounts());
  }, []);

  const qrUrl = (url: string) => `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(url)}`;

  const handleOpen = (globalIndex: number, localIndex: number) => {
    const newCount = incrementGiftCount(globalIndex);
    setCounts(loadGiftCounts());
    setOpenIndex(openIndex === localIndex ? null : localIndex);
  };

  return (
    <div className="w-full flex justify-center">
      <style>{`.gift-shake:hover{transform: translateY(-6px) rotate(-6deg); transition: transform 220ms ease;}`}</style>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl">
        {items.map((link, i) => (
          <div key={i} className="flex flex-col items-center">
            <button
              onClick={() => handleOpen(startIndex + i, i)}
              className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-tr from-amber-400/10 to-pink-400/6 border border-slate-700 rounded-lg shadow-lg flex items-center justify-center gift-shake"
              aria-label={`Open gift ${i + 1}`}
            >
              <div className="text-center">
                <img src={GIFT_BOX_IMG} alt="gift" className="w-14 h-14 object-cover rounded-md" />
                <div className="text-xs mt-1 text-slate-300">Gift {startIndex + i + 1}</div>
              </div>
            </button>

            {openIndex === i && (
              <div className="mt-2 p-2 bg-black/80 border border-slate-700 rounded">
                <img src={qrUrl(link)} alt={`QR for gift ${i + 1}`} className="w-36 h-36 object-contain" />
                <div className="text-xs text-slate-400 mt-1 text-center">Opened: {counts[startIndex + i] || 0} times</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftGrid;
