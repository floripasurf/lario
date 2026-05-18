'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListingGalleryProps {
  photos: string[];
  title: string;
}

export function ListingGallery({ photos, title }: ListingGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted/50 flex flex-col items-center justify-center rounded-2xl border border-border/50">
        <svg className="w-12 h-12 text-muted-foreground/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
        <p className="text-muted-foreground text-sm">Sem fotos</p>
      </div>
    );
  }

  return (
    <div className="relative group/gallery">
      <div className="aspect-[16/9] md:aspect-[2/1] relative overflow-hidden rounded-2xl bg-muted/30">
        <Image
          key={current}
          src={photos[current]}
          alt={`${title} - Foto ${current + 1}`}
          fill
          className="object-cover animate-fade-in"
          priority={current === 0}
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        {/* Gradient overlay at bottom for counter readability */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {photos.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover/gallery:opacity-90 hover:!opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-black/50 hover:scale-105"
            onClick={() => setCurrent((current - 1 + photos.length) % photos.length)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover/gallery:opacity-90 hover:!opacity-100 transition-all duration-200 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-black/50 hover:scale-105"
            onClick={() => setCurrent((current + 1) % photos.length)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium tabular-nums">
            {current + 1} / {photos.length}
          </div>
        </>
      )}

      {photos.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                i === current
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                  : 'opacity-60 hover:opacity-90 hover:scale-105'
              }`}
            >
              <Image src={photo} alt={`Miniatura ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
