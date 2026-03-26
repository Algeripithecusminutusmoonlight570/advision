import React from 'react';
import { Coffee, Monitor, Shirt, Layout, Smartphone, ShoppingBag } from 'lucide-react';

export const MEDIUMS = [
  { id: 'coffee mug', label: 'Coffee Mug', icon: Coffee },
  { id: 'billboard', label: 'Billboard', icon: Layout },
  { id: 't-shirt', label: 'T-Shirt', icon: Shirt },
  { id: 'laptop screen', label: 'Laptop', icon: Monitor },
  { id: 'smartphone screen', label: 'Smartphone', icon: Smartphone },
  { id: 'tote bag', label: 'Tote Bag', icon: ShoppingBag },
];

interface MediumSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export const MediumSelector: React.FC<MediumSelectorProps> = ({ selected, onToggle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {MEDIUMS.map((medium) => {
        const Icon = medium.icon;
        const isSelected = selected.includes(medium.id);
        return (
          <button
            key={medium.id}
            onClick={() => onToggle(medium.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 ${
              isSelected
                ? 'bg-black border-black text-white shadow-lg scale-[1.02]'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
            <span className="text-xs font-semibold uppercase tracking-wider">{medium.label}</span>
          </button>
        );
      })}
    </div>
  );
};
