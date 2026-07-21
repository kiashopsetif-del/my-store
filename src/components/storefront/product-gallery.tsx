"use client";

import { useState, useCallback, useEffect } from "react";

export default function ProductGallery({ images, discount }: { images: string[]; discount?: number }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play every 4 seconds
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [autoPlay, next, images.length]);

  if (images.length === 0) {
    return (
      <div className="grid h-full w-full place-items-center rounded-[2rem] border border-white/10 bg-white/[0.02] text-6xl text-zinc-700">
        🖼️
      </div>
    );
  }

  return (
    <div>
      {/* Main image with slider */}
      <div
        className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        {discount && discount > 0 && (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            خصم {discount}%
          </span>
        )}
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="السابق"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="التالي"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-[var(--accent)]"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`صورة ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative aspect-square h-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === current
                  ? "border-[var(--accent)]"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
