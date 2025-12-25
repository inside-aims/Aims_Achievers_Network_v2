'use client';

import {Card, CardContent} from "@/components/ui/card";
import React from "react";
import {LucideIcon} from "lucide-react";

export const StatCard = (
  {
    icon: Icon,
    value,
    label,
    color
  }: {
    icon: LucideIcon,
    value: string,
    label: string,
    color: string
  }) => (
  <div className="group cursor-pointer">
    <Card className="rounded-card p-2 md:p-4 bg-card hover:bg-accent transition-all duration-300 hover:scale-105 border-border">
      <CardContent className="p-0 text-center">
        <div className={`inline-flex items-center justify-center w-6 md:w-12 h-6 md:h-12 rounded-full bg-${color}/10 border border-${color}/20 mb-2`}>
          <Icon className={`w-4 md:w-6 h-4 md:h-6 text-${color}`} />
        </div>
        <div className="text-sm md:text-3xl font-bold text-foreground mb-1">
          {value}
        </div>
        <div className="text-muted-foreground text-xs md:text-sm">
          {label}
        </div>
      </CardContent>
    </Card>
  </div>
);