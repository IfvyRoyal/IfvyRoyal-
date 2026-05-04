import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { MoveHorizontal } from "lucide-react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function ImageComparisonSlider({ beforeImage, afterImage, className = "" }: ImageComparisonSliderProps) {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const position = useMotionValue(50);
  const smoothPosition = useSpring(position, { stiffness: 100, damping: 20 });

  // Transforms for style props
  const clipPath = useTransform(smoothPosition, (v) => `inset(0 ${100 - v}% 0 0)`);
  const leftPosition = useTransform(smoothPosition, (v) => `${v}%`);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    position.set(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  // Auto-slide effect on mount to show it's interactive
  useEffect(() => {
    const timer = setTimeout(() => {
      position.set(45);
      setTimeout(() => position.set(50), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [position]);

  return (
    <div 
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-[2rem] shadow-2xl bg-neutral-200 cursor-col-resize ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsResizing(true)}
      onMouseUp={() => setIsResizing(false)}
      onMouseLeave={() => setIsResizing(false)}
    >
      {/* After Image (Base) */}
      <img 
        src={afterImage} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
      />

      {/* Before Image (Clipping) */}
      <motion.div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Handle */}
      <motion.div 
        className="absolute inset-y-0 w-1 bg-white/50 backdrop-blur-sm z-10"
        style={{ left: leftPosition }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-amber-600 border border-amber-100 ring-4 ring-black/5">
          <MoveHorizontal className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <span className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-800 shadow-sm border border-white/50">
          Original
        </span>
      </div>
      <div className="absolute top-6 right-6 z-20 pointer-events-none">
        <span className="bg-amber-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm border border-amber-500/50">
          Digital Makeover
        </span>
      </div>
    </div>
  );
}
