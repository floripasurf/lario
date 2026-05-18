'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phone: string;
  listingId: string;
  listingTitle: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  variant?: 'full' | 'icon';
}

export function WhatsAppButton({
  phone,
  listingId,
  listingTitle,
  size = 'lg',
  className = '',
  variant = 'full',
}: WhatsAppButtonProps) {
  // Format phone: remove +, keep only digits
  const cleanPhone = phone.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Olá! Vi seu imóvel "${listingTitle}" no Lario e tenho interesse. Podemos conversar?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

  const handleClick = () => {
    // Log the lead asynchronously (fire and forget)
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId }),
    }).catch(() => {});

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors ${className}`}
        title="Conversar no WhatsApp"
        aria-label="Conversar no WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      className={`bg-[#25D366] hover:bg-[#1FAD54] text-white shadow-sm shadow-[#25D366]/20 hover:shadow-lg hover:shadow-[#25D366]/25 transition-all duration-300 ${className}`}
      size={size}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Conversar no WhatsApp
    </Button>
  );
}
