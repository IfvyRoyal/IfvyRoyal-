/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Camera, MapPin, Shirt, Scissors, Wand2, Star, ChevronRight, Save, Trash2, FolderHeart, Share2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageComparisonSlider } from "./components/ImageComparisonSlider";

interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  date: string;
}

const CATEGORIES = ["All", "Gala", "Professional", "Casual Luxury", "Evening"];

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Gala");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("glamour_portfolio");
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load portfolio", e);
      }
    }
  }, []);

  // Save portfolio to localStorage
  const persistPortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem("glamour_portfolio", JSON.stringify(newPortfolio));
  };

  const handleSave = () => {
    if (!newItemName.trim()) return;

    const item: PortfolioItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      category: newItemCategory,
      beforeImage: "input_file_0.png",
      afterImage: "styled_makeover.png",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    persistPortfolio([item, ...portfolio]);
    setNewItemName("");
    setIsSaveModalOpen(false);
  };

  const deleteItem = (id: string) => {
    persistPortfolio(portfolio.filter(item => item.id !== id));
  };

  const handleShare = async (item?: PortfolioItem) => {
    const title = item ? `My ${item.name} Style` : "My AI Luxury Makeover";
    const text = item 
      ? `Check out my ${item.category} transformation at Glamour Studio!` 
      : "I just got a high-class digital makeover at Glamour Studio!";
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Sharing failed", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
        setCopyFeedback(item?.id || "main");
        setTimeout(() => setCopyFeedback(null), 2000);
      } catch (err) {
        console.error("Copy failed", err);
      }
    }
  };

  const filteredPortfolio = activeCategory === "All" 
    ? portfolio 
    : portfolio.filter(item => item.category === activeCategory);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen luxury-gradient selection:bg-amber-200">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-2xl tracking-tight">GLAMOUR STUDIO</h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase text-neutral-600">
          <a href="#portfolio" className="hover:text-amber-600 transition-colors">Portfolios</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Bespoke Styling</a>
          <a href="#" className="text-amber-700">Digital Makeover</a>
        </div>
        <button className="bg-neutral-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-neutral-200 flex items-center gap-2">
          <FolderHeart className="w-4 h-4" />
          My Cabinet
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Star className="w-3 h-3" />
              <span>AI Styling Transformation</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display mb-8 leading-[1.1]">
              Elevate Your <br />
              <span className="text-amber-600 italic">Prestige</span> Look
            </h2>
            <p className="text-lg text-neutral-600 mb-10 max-w-lg leading-relaxed">
              Experience a high-end digital makeover. We've reimagined your look with refined aesthetics: from elegant drapery to sophisticated silhouettes, set within the world's most exclusive venues.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                <div className="bg-amber-50 p-3 rounded-xl">
                  <Scissors className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold">Elite Hair Styling</h4>
                  <p className="text-sm text-neutral-500">Sleek, side-parted polished waves</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                <div className="bg-amber-50 p-3 rounded-xl">
                  <Shirt className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold">Bespoke Boutique Outfit</h4>
                  <p className="text-sm text-neutral-500">Olive green luxury coordinates with gold hardware</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                <div className="bg-amber-50 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold">Destination Context</h4>
                  <p className="text-sm text-neutral-500">Premium High-Class Restaurant Setting</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={() => setIsSaveModalOpen(true)}
                className="flex-1 md:flex-none bg-amber-600 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-900/20"
              >
                <Save className="w-5 h-5" />
                Save Look
              </button>
              
              <button 
                onClick={() => handleShare()}
                className="flex-1 md:flex-none bg-white text-neutral-800 px-8 py-4 rounded-full font-bold border border-amber-100 hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
              >
                {copyFeedback === "main" ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share Essence
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <ImageComparisonSlider 
              beforeImage="input_file_0.png"
              afterImage="styled_makeover.png"
              className="aspect-[4/5] w-full"
            />

            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 md:-right-12 bg-white p-4 rounded-2xl shadow-xl border border-amber-50 max-w-[200px]"
            >
              <div className="flex -space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200 overflow-hidden">
                  <img src="input_file_0.png" alt="Before" className="w-full h-full object-cover" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-amber-600 flex items-center justify-center text-white text-[10px] font-bold">
                  TO
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200 overflow-hidden">
                  <img src="styled_makeover.png" alt="After" className="w-full h-full object-cover" />
                </div>
              </div>
              <p className="text-xs font-medium text-neutral-800">Transformation Complete</p>
              <p className="text-[10px] text-neutral-400">Venue: Fine Dining Restaurant</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Portfolio Section */}
        <section id="portfolio" className="mb-24 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h3 className="text-4xl font-display mb-2">Exquisite Portfolio</h3>
              <p className="text-neutral-500">Your personal archive of curated digital transformations.</p>
            </div>
            
            <div className="flex gap-2 p-1 bg-white rounded-full border border-amber-100 shadow-sm">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat 
                      ? "bg-amber-600 text-white shadow-md shadow-amber-900/10" 
                      : "text-neutral-500 hover:text-amber-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPortfolio.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="empty"
                  className="col-span-full py-20 text-center bg-white/30 rounded-[3rem] border-2 border-dashed border-amber-100"
                >
                  <FolderHeart className="w-12 h-12 text-amber-200 mx-auto mb-4" />
                  <p className="text-neutral-400 font-medium">Your cabinet is empty. Save your first look above.</p>
                </motion.div>
              ) : (
                filteredPortfolio.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all border border-amber-50"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                      <img src={item.afterImage} className="w-full h-full object-cover" alt={item.name} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-amber-800 uppercase">
                        {item.category}
                      </div>
                      
                      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleShare(item)}
                          className="p-2 bg-white text-amber-600 rounded-xl shadow-lg hover:bg-amber-600 hover:text-white transition-all"
                          title="Share transformation"
                        >
                          {copyFeedback === item.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white shadow-lg transition-all"
                          title="Delete transformation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="px-2">
                      <h4 className="font-bold text-neutral-800">{item.name}</h4>
                      <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest mt-1 tracking-tighter">{item.date}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display mb-4">Curated Style Elements</h3>
            <p className="text-neutral-500">The intricate details that define the prestige aesthetic.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Gilded Accessories", 
                desc: "Hand-picked Bottega-style woven clutch in gold finish and matching high-heeled sandals.",
                icon: <Sparkles className="w-6 h-6" />
              },
              { 
                title: "Artisanal Nails", 
                desc: "Luxury stiletto nails with gold foil accents and crystalline white tips.",
                icon: <Wand2 className="w-6 h-6" />
              },
              { 
                title: "Atmospheric Lighting", 
                desc: "Professional restaurant lighting designed to complement a warm, radiant complexion.",
                icon: <Camera className="w-6 h-6" />
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-amber-50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-amber-600/5 rounded-2xl flex items-center justify-center text-amber-600 mb-6 font-bold">
                  {i + 1}
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-neutral-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-300 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-white text-3xl md:text-5xl font-display mb-6">Ready for your own makeover?</h3>
            <p className="text-neutral-400 mb-10 max-w-2xl mx-auto">Upload your reference photo and let our AI stylists curate the perfect luxury ensemble for any occasion.</p>
            
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        alert(`Photo "${file.name}" received! Our AI stylists are preparing your luxury look.`);
                      }
                    }}
                  />
                  <div className="bg-amber-600 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-500 transition-all flex items-center gap-2 group shadow-xl shadow-amber-900/20">
                    <Camera className="w-5 h-5" />
                    Upload & Transform
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </label>
                <button className="text-white px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/10 transition-all">
                  View Style Guide
                </button>
              </div>
              
              <div className="text-neutral-500 text-xs flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Supports JPG, PNG, and HEIC up to 20MB
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-amber-100 mt-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale brightness-50 opacity-50">
            <Sparkles className="w-5 h-5" />
            <h1 className="font-display text-xl tracking-tight">GLAMOUR STUDIO</h1>
          </div>
          <p className="text-neutral-400 text-sm italic">Designed for the sophisticated individual.</p>
          <div className="flex gap-6 text-neutral-500 text-sm">
            <a href="#" className="hover:text-amber-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>

      {/* Save Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-600" />
              <h3 className="text-3xl font-display mb-2">Preserve Your Look</h3>
              <p className="text-neutral-500 text-sm mb-8 font-medium">Add this masterpiece to your personal collection.</p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block px-1">Ensemble Name</label>
                  <input 
                    type="text" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Midnight Soirée"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition-all placeholder:text-neutral-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block px-1">Categorization</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.slice(1).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewItemCategory(cat)}
                        className={`px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                          newItemCategory === cat 
                            ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-900/20" 
                            : "bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-amber-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsSaveModalOpen(false)}
                    className="flex-1 px-8 py-4 rounded-full font-bold text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!newItemName.trim()}
                    className="flex-1 bg-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

