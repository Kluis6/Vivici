"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GoHomeFill } from "react-icons/go";
import { LuMenu } from "react-icons/lu";
import { ImInstagram } from "react-icons/im";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/admin", label: "Painel" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-[rgba(7,21,37,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex w-full container items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center  bg-accent-soft text-sm font-semibold text-primary-foreground">
            <GoHomeFill className="size-6" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-sm uppercase tracking-[0.3rem] text-muted">
              ViviC
            </p>
            <p className="text-xs font-semibold text-foreground">
              Imobiliária digital
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {links.map((link) => (
            <Badge
              key={link.href}
              variant="outline"
              render={
                <Link
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white/6"
                />
              }
            >
              {link.label}
            </Badge>
          ))}
        </nav>

        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden size-10 rounded-none"
            >
              <span className="sr-only">Toggle menu</span>
              <LuMenu className="size-6 text-muted" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="uppercase tracking-[0.3rem] text-muted font-mono">
                ViviC
              </DrawerTitle>
              <DrawerDescription className="text-foreground">
                Imobiliária digital
              </DrawerDescription>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              <nav className="gap-3 flex flex-col">
                {links.map((link) => (
                  <div key={link.href}>
                    <DrawerClose asChild>
                      <Link
                        href={link.href}
                        className="py-2 text-sm font-medium text-foreground transition hover:bg-white/6"
                      >
                        {link.label}
                      </Link>
                    </DrawerClose>
                  </div>
                ))}
              </nav>
            </div>
            <DrawerFooter className="flex flex-row items-center justify-center gap-4">
              <DrawerClose asChild>
                <Link
                  href="/"
                  className="size-10 flex items-center justify-center border border-border/70  text-primary-foreground"
                >
                  
              
                  
                  <FaSquareFacebook className="size-6 text-accent"/>
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href="/"
                  className="size-10 flex items-center justify-center border border-border/70  text-primary-foreground"
                ><ImInstagram className="size-5 text-accent" /></Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href="/"
                  className="size-10 flex items-center justify-center border border-border/70  text-primary-foreground"
                >
                <FaLinkedin  className="size-6 text-accent" />
                </Link>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
