"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type SegmentErrorStateProps = {
  title: string;
  description: string;
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
};

export function SegmentErrorState({
  title,
  description,
  error,
  unstable_retry,
  reset,
}: SegmentErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="rounded-[2rem] border border-[rgba(215,108,76,0.28)] bg-[rgba(215,108,76,0.08)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--accent-soft)]">
        Falha de carregamento
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-muted-foreground">Digest: {error.digest}</p>
      ) : null}
      {retry ? (
        <Button onClick={() => retry()} className="mt-6 rounded-full">
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
