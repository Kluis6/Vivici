"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { LuMenu } from "react-icons/lu";
import { ImInstagram } from "react-icons/im";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const links = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/admin", label: "Painel" },
];

const whatsappNumber = "5521980122156";
const whatsappMessage =
  "Olá, Vivi! Vim pelo site da Vivici e gostaria de falar sobre um imóvel.";
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: 0.14 + index * 0.06,
      ease: "easeOut" as const,
    },
  }),
};

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-[rgba(7,21,37,0.76)] backdrop-blur-xl">
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto flex w-full container items-center justify-between p-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        >
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
        </motion.div>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link, index) => (
            <motion.li
              key={link.href}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              className=" text-white hover:text-accent  "
            >
              <Link
                href={link.href}
                className="px-4 py-2 text-sm font-light transition-all hover:bg-white/6 "
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <Tooltip>
          <TooltipTrigger>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
            >
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar com a Vivi no WhatsApp"
                className="rounded-none size-10 bg-green-700 text-white hover:bg-green-800 active:bg-green-900 hidden md:flex justify-center items-center"
              >
                <FaWhatsapp className="size-6 " />
              </Link>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Fale conosco!</p>
          </TooltipContent>
        </Tooltip>

        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden size-10 rounded-none"
            >
              <span className="sr-only">menu</span>
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
            <nav className="gap-3 px-4 flex flex-col justify-between h-full">
              <ul className=" flex flex-col gap-2 w-full ">
                {links.map((link) => (
                  <li key={link.href}>
                    <DrawerClose asChild>
                      <Link
                        href={link.href}
                        className=" text-sm  font-medium transition-all  w-full block "
                      >
                        {link.label}
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>

              <div>
                <DrawerClose asChild>
                  <Link
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 h-10 text-sm font-medium text-white transition bg-green-700 hover:bg-green-800 active:bg-green-900 justify-center w-full"
                  >
                    <FaWhatsapp className="size-5" />
                    Fale conosco!
                  </Link>
                </DrawerClose>
              </div>
            </nav>
            <DrawerFooter className="flex flex-row items-center justify-center gap-4">
              <DrawerClose asChild>
                <Link
                  href="/"
                  className="size-12 flex items-center justify-center border border-border/70  text-primary-foreground"
                >
                  <FaSquareFacebook className="size-7 text-accent" />
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href="/"
                  className="size-12 flex items-center justify-center border border-border/70  text-primary-foreground"
                >
                  <ImInstagram className="size-6 text-accent" />
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href="/"
                  className="size-12 flex items-center justify-center border border-border/70  text-primary-foreground"
                >
                  <FaLinkedin className="size-7 text-accent" />
                </Link>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </motion.nav>
    </header>
  );
}
