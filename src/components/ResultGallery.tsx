import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Result {
  id: string;
  url: string;
  medium: string;
  loading?: boolean;
}

interface ResultGalleryProps {
  results: Result[];
}

export const ResultGallery: React.FC<ResultGalleryProps> = ({ results }) => {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      <AnimatePresence mode="popLayout">
        {results.map((result) => (
          <motion.div
            key={result.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-black/5"
          >
            <div className="aspect-[4/3] relative bg-gray-50 flex items-center justify-center">
              {result.loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-black animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Generating {result.medium}...</p>
                </div>
              ) : (
                <>
                  <img
                    src={result.url}
                    alt={result.medium}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a
                      href={result.url}
                      download={`advision-${result.medium}.png`}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </>
              )}
            </div>
            <div className="p-5 flex justify-between items-center bg-white border-t border-gray-50">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Marketing Medium</p>
                <h3 className="text-sm font-semibold text-gray-900 capitalize">{result.medium}</h3>
              </div>
              {!result.loading && (
                <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Ready
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
