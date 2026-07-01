"use client";

import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { CheckIcon, CopyIcon, SendIcon, Share2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type PropertyShareActionsProps = {
  title: string;
};

export function PropertyShareActions({ title }: PropertyShareActionsProps) {
  const [pageUrl, setPageUrl] = useState<string>("");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPageUrl(window.location.href);

    const mediaQuery = window.matchMedia(
      "(max-width: 767px), (hover: none) and (pointer: coarse)"
    );

    const updateDevice = () => {
      setIsMobileDevice(mediaQuery.matches);
    };

    updateDevice();
    mediaQuery.addEventListener("change", updateDevice);

    return () => {
      mediaQuery.removeEventListener("change", updateDevice);
    };
  }, []);

  const whatsappHref = useMemo(() => {
    const text = `Olá! Tenho interesse neste imóvel: ${title} ${pageUrl}`.trim();
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [pageUrl, title]);

  const telegramHref = useMemo(() => {
    const text = `Confira este imóvel: ${title}`;
    return `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(text)}`;
  }, [pageUrl, title]);

  const handleWhatsapp = () => {
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    if (!pageUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt("Copie o link deste imóvel:", pageUrl);
    }
  };

  const handleShare = async () => {
    if (!pageUrl) {
      return;
    }

    if (isMobileDevice && navigator.share) {
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

    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" className="rounded-none h-10  bg-green-700 text-white hover:bg-green-800 active:bg-green-900" onClick={handleWhatsapp}>
          <FaWhatsapp data-icon="inline-start" className="size-5" />
          Fale conosco
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-none h-10"
          onClick={handleShare}
        >
          <Share2Icon data-icon="inline-start" />
          Compartilhar imóvel
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="gap-6">
          <SheetHeader>
            <SheetTitle>Compartilhar imóvel</SheetTitle>
            <SheetDescription>
              Envie este imóvel pelo canal que preferir ou copie o link da página.
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-none"
              onClick={() =>
                window.open(whatsappHref, "_blank", "noopener,noreferrer")
              }
            >
              <FaWhatsapp data-icon="inline-start" />
              Compartilhar no WhatsApp
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-none"
              onClick={() =>
                window.open(telegramHref, "_blank", "noopener,noreferrer")
              }
            >
              <FaTelegramPlane data-icon="inline-start" />
              Compartilhar no Telegram
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start rounded-none"
              onClick={handleCopyLink}
            >
              {copied ? (
                <CheckIcon data-icon="inline-start" />
              ) : (
                <CopyIcon data-icon="inline-start" />
              )}
              {copied ? "Link copiado" : "Copiar link"}
            </Button>

            <div className="rounded-none border border-border/70 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
              <div className="mb-1 flex items-center gap-2 text-foreground">
                <SendIcon className="size-4" />
                Link do imóvel
              </div>
              <p className="break-all">{pageUrl || "Carregando link..."}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
