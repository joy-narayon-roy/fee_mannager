import { useEffect, useState } from "react";

export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: Record<Exclude<Breakpoint, "base">, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function getBreakpoint(width: number): Breakpoint {
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "base";
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth)
      : "base"
  );

  useEffect(() => {
    const onResize = () => {
      setBp(getBreakpoint(window.innerWidth));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return bp;
}
