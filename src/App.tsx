import { useState } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageUpload } from './components/ImageUpload';
import { MediumSelector } from './components/MediumSelector';
import { ResultGallery } from './components/ResultGallery';
import { visualizeProduct } from './lib/gemini';

interface Result {
  id: string;
  url: string;
  medium: string;
  loading?: boolean;
}

export default function App() {
  const [sourceImage, setSourceImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleMedium = (id: string) => {
    setSelectedMediums(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleVisualize = async () => {
    if (!sourceImage || selectedMediums.length === 0) return;

    setIsProcessing(true);
    
    // Create placeholder results
    const newResults: Result[] = selectedMediums.map(medium => ({
      id: Math.random().toString(36).substr(2, 9),
      url: '',
      medium,
      loading: true
    }));

    setResults(prev => [...newResults, ...prev]);

    // Process each medium
    for (const result of newResults) {
      try {
        const imageUrl = await visualizeProduct(
          sourceImage.base64,
          sourceImage.mimeType,
          result.medium
        );
        
        setResults(prev => prev.map(r => 
          r.id === result.id ? { ...r, url: imageUrl, loading: false } : r
        ));
      } catch (error) {
        console.error(`Error generating ${result.medium}:`, error);
        setResults(prev => prev.filter(r => r.id !== result.id));
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 selection:bg-black selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">AdVision AI</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hidden sm:block">Powered by Gemini 2.5</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">01</div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Upload Product</h2>
              </div>
              <ImageUpload 
                onImageSelect={(base64, mimeType) => setSourceImage({ base64, mimeType })} 
              />
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">02</div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Select Mediums</h2>
              </div>
              <MediumSelector 
                selected={selectedMediums} 
                onToggle={handleToggleMedium} 
              />
            </section>

            <button
              onClick={handleVisualize}
              disabled={!sourceImage || selectedMediums.length === 0 || isProcessing}
              className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-xl shadow-black/10"
            >
              {isProcessing ? 'Processing...' : (
                <>
                  Visualize <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Hero & Results */}
          <div className="lg:col-span-7">
            {results.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                  <Sparkles className="w-8 h-8 text-gray-300" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                  Transform your product into <span className="text-gray-400 italic">marketing gold.</span>
                </h1>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                  Upload a single product shot and instantly visualize it across professional marketing assets while maintaining perfect brand consistency.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Generated Visuals</h2>
                  <button 
                    onClick={() => setResults([])}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <ResultGallery results={results} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium text-gray-400 tracking-wider uppercase">© 2026 AdVision AI • Experimental Lab</p>
          <div className="flex gap-8">
            <a href="#" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Privacy</a>
            <a href="#" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Terms</a>
            <a href="#" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
