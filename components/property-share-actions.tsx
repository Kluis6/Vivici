"use client";

import { useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Share2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

type PropertyShareActionsProps = {
  title: string;
};

export function PropertyShareActions({ title }: PropertyShareActionsProps) {
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const whatsappHref = useMemo(() => {
    const text = `Olá! Tenho interesse neste imóvel: ${title} ${pageUrl}`.trim();
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [pageUrl, title]);

  const handleWhatsapp = () => {
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  const handleShare = async () => {
    if (!pageUrl) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Confira este imóvel: ${title}`,
          url: pageUrl,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      window.alert("Link copiado para a área de transferência.");
    } catch {
      window.prompt("Copie o link deste imóvel:", pageUrl);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button type="button" className="rounded-none" onClick={handleWhatsapp}>
        <FaWhatsapp data-icon="inline-start" />
        Falar no WhatsApp
      </Button>
      <Button
        type="button"
        variant="outline"
        className="rounded-none"
        onClick={handleShare}
      >
        <Share2Icon data-icon="inline-start" />
        Compartilhar imóvel
      </Button>
    </div>
  );
}
