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
      <div className="aspect-[16/9] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Sem fotos</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
        <Image
          src={photos[current]}
          alt={`${title} - Foto ${current + 1}`}
          fill
          className="object-cover"
          priority={current === 0}
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>

      {photos.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setCurrent((current - 1 + photos.length) % photos.length)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setCurrent((current + 1) % photos.length)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {current + 1} / {photos.length}
          </div>
        </>
      )}

      {photos.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-20 h-14 flex-shrink-0 rounded overflow-hidden border-2 ${
                i === current ? 'border-primary' : 'border-transparent'
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
