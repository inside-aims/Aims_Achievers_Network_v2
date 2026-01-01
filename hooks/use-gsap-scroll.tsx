"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGsapScroll() {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      gsap.registerPlugin(ScrollTrigger)
      initialized.current = true
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return { gsap, ScrollTrigger }
}
