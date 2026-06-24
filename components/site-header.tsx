"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GoHomeFill } from "react-icons/go";
import { LuMenu } from "react-icons/lu";
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
            <p className="font-mono text-sm uppercase tracking-widest text-muted">
              ViviC
            </p>
            {/* <p className="text-xs font-semibold text-foreground">
              Imobiliária digital
            </p> */}
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
            <Button size="icon" variant="ghost" className="md:hidden size-10">
              <span className="sr-only">Toggle menu</span>
              <LuMenu className="size-6 text-muted" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <p key={index} className="mb-4 leading-normal">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
              ))}
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
