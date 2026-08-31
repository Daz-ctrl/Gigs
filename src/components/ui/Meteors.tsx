"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Meteors({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) {
  const [meteors, setMeteors] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: number }).map((_, idx) => ({
      id: idx,
      left: Math.floor(Math.random() * 800 - 200) + "px",
      delay: (Math.random() * 0.8 + 0.2).toFixed(2) + "s",
      duration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteors(generated);
  }, [number]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-emerald-400 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-emerald-400 before:to-transparent"
          )}
          style={{
            top: 0,
            left: meteor.left,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
    </div>
  );
}
