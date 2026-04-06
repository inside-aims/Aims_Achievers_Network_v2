"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[54px_54px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-[12rem] md:text-[16rem] font-light leading-none font-serif text-primary/10 select-none block mb-4"
        >
          404
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-12 md:mt-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"
          >
            <Search className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-serif mb-4 text-foreground">
            Page not found
          </h1>
          
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed font-light">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-8">
            <Button asChild size="lg" className="w-full sm:flex-1 font-mono text-xs tracking-widest px-8">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                RETURN HOME
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:flex-1 font-mono text-xs tracking-widest px-8">
              <Link href="/events">
                BROWSE EVENTS
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
