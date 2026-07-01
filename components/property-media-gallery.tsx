"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

type PropertyMediaGalleryProps = {
  items: Array<{
    id: string
    url: string
    alt: string | null
  }>
  title: string
}

export function PropertyMediaGallery({
  items,
  title,
}: PropertyMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [mainApi, setMainApi] = React.useState<CarouselApi>()
  const [dialogApi, setDialogApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!mainApi) {
      return
    }

    const syncActiveSlide = () => {
      setActiveIndex(mainApi.selectedScrollSnap())
    }

    syncActiveSlide()
    mainApi.on("select", syncActiveSlide)

    return () => {
      mainApi.off("select", syncActiveSlide)
    }
  }, [mainApi])

  React.useEffect(() => {
    if (!dialogApi || !isDialogOpen) {
      return
    }

    dialogApi.scrollTo(activeIndex, true)
  }, [activeIndex, dialogApi, isDialogOpen])

  const handleOpenImage = (index: number) => {
    setActiveIndex(index)
    setIsDialogOpen(true)
  }

  const handleSelectImage = (index: number) => {
    setActiveIndex(index)
    mainApi?.scrollTo(index)
  }

  return (
    <>
      <Carousel
        setApi={setMainApi}
        opts={{ align: "start", loop: items.length > 1 }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {items.map((media, index) => (
            <CarouselItem
              key={media.id}
              className="basis-full pl-0 sm:basis-1/2 xl:basis-1/3"
            >
              <button
                type="button"
                onClick={() => handleOpenImage(index)}
                className="group relative block w-full overflow-hidden border border-border bg-surface/80 text-left outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Abrir imagem ${index + 1} de ${items.length}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.url}
                  alt={media.alt ?? title}
                  className="aspect-4/3 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgba(7,21,37,0.82)] to-transparent px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-accent-soft">
                    Imagem {index + 1}
                  </p>
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {items.length > 1 ? (
          <>
            <CarouselPrevious className="border-border bg-[rgba(7,21,37,0.78)] text-foreground hover:bg-[rgba(7,21,37,0.92)]" />
            <CarouselNext className="border-border bg-[rgba(7,21,37,0.78)] text-foreground hover:bg-[rgba(7,21,37,0.92)]" />
          </>
        ) : null}
      </Carousel>

      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted">
        <span>
          {activeIndex + 1} / {items.length}
        </span>
        <span>Clique para ampliar</span>
      </div>

      {items.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {items.map((media, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={`${media.id}-thumb`}
                type="button"
                onClick={() => handleSelectImage(index)}
                className={cn(
                  "relative shrink-0 overflow-hidden border bg-surface/80 outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring",
                  "w-24 sm:w-28",
                  isActive
                    ? "border-accent-soft ring-1 ring-accent-soft"
                    : "border-border opacity-70 hover:opacity-100"
                )}
                aria-label={`Ir para imagem ${index + 1}`}
                aria-pressed={isActive}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.url}
                  alt={media.alt ?? `${title} - miniatura ${index + 1}`}
                  className="aspect-4/3 h-full w-full object-cover"
                />
                <div
                  className={cn(
                    "absolute inset-0 transition-colors",
                    isActive ? "bg-transparent" : "bg-[rgba(7,21,37,0.25)]"
                  )}
                />
              </button>
            )
          })}
        </div>
      ) : null}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-[min(96vw,1200px)] rounded-none border-border bg-[rgba(7,21,37,0.96)] p-4 sm:max-w-[min(96vw,1200px)]"
          showCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Galeria do imóvel {title}</DialogTitle>
            <DialogDescription>
              Visualização ampliada das imagens do imóvel.
            </DialogDescription>
          </DialogHeader>

          <Carousel
            setApi={setDialogApi}
            opts={{ startIndex: activeIndex, loop: items.length > 1 }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {items.map((media, index) => (
                <CarouselItem key={`${media.id}-dialog`} className="pl-0">
                  <div className="flex min-h-[60vh] items-center justify-center bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={media.url}
                      alt={media.alt ?? `${title} - imagem ${index + 1}`}
                      className={cn(
                        "max-h-[78vh] w-auto max-w-full object-contain",
                        "border border-border/60"
                      )}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {items.length > 1 ? (
              <>
                <CarouselPrevious className="left-4 border-border bg-[rgba(7,21,37,0.84)] text-foreground hover:bg-[rgba(7,21,37,0.96)]" />
                <CarouselNext className="right-4 border-border bg-[rgba(7,21,37,0.84)] text-foreground hover:bg-[rgba(7,21,37,0.96)]" />
              </>
            ) : null}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}
