"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Herosection() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-cover">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-10 bg-surface/10 backdrop-brightness-90"
      />

      <motion.div
        initial={{ scale: 1.06, opacity: 0.78 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/Gemini_Generated_Image_3hkj2c3hkj2c3hkj.png"
          alt="Destaque"
          fill
          priority
          className="absolute object-cover"
        />
      </motion.div>

      <div className="absolute z-20 flex h-full w-full flex-col justify-between p-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="flex w-full flex-col gap-4 md:w-1/2"
        >
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: "easeOut" }}
            className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl"
          >
            Encontre seu lar ideal de forma rápida e simples
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: "easeOut" }}
          className="flex w-full lg:justify-end justify-center"
        >
          <motion.div whileTap={{ scale: 0.985 }} className="w-full md:w-auto">
            <Link
              className="rounded-none bg-accent-soft h-11 flex-1 shadow flex justify-center items-center  text-sm font-semibold w-full md:w-xs "
              href="/imoveis"
            >
                <span className="hover:bg-accent-soft/90 text-primary-foreground">Ver imóveis </span>
              
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
