"use client";

import { ReactLenis } from "lenis/react";

const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  return <ReactLenis root>{children}</ReactLenis>;
};

export default LenisProvider;
