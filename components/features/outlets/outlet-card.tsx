'use client';

import {Card, CardContent} from "@/components/ui/card";
import {Globe, MapPin, MessageCircle, Phone, Zap} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import React from "react";
import {Outlet,} from "@/components/features/outlets/index";
import {PortfolioGallery} from "@/components/features/outlets/portfolio-gallery";
import {Button} from "@/components/ui/button";

export const OutletCard = (
  {
    outlet,
    activeImage,
    index,
    verified,
  }: {
  outlet: Outlet;
  activeImage: number;
  index: number;
  verified: boolean;
}) => {
  const isReversed = index % 2 === 1;

  return (
    <Card className="rounded-card overflow-hidden border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl p-0">
      <div className={`flex flex-col items-center justify-between md:flex-row ${isReversed ? 'md:flex-row-reverse' : ''}`}>
        <div className="md:w-1/2">
          <PortfolioGallery
            images={outlet.portfolioImages}
            vendorId={outlet.id}
            activeIndex={activeImage}
            verified={verified}
          />
        </div>

        {/* Content */}
        <CardContent className="p-2 md:p-4 bg-card md:w-1/2">
          <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
            {outlet.name}
          </h3>
          <p className="text-primary/80 text-sm mb-2 italic">{outlet.tagline}</p>
          <p className="text-muted-foreground mb-4 text-sm md:text-base">{outlet.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-card bg-muted/50 border border">
              <div className="text-base md:text-2xl font-bold text-foreground">{outlet.yearsExperience}</div>
              <div className="text-muted-foreground text-xs">Years</div>
            </div>
            <div className="text-center p-2 rounded-card bg-muted/50">
              <div className="text-base md:text-2xl font-bold text-foreground">{outlet.completedOrders.toLocaleString()}</div>
              <div className="text-muted-foreground text-xs">Orders</div>
            </div>
            <div className="text-center p-2 rounded-card bg-muted/50">
              <div className="text-base md:text-2xl font-bold text-foreground">{outlet.clientSatisfaction}%</div>
              <div className="text-muted-foreground text-xs">Satisfaction</div>
            </div>
          </div>

          {/* Location & Response */}
          <div className="flex items-center space-x-2 md:space-x-4 mb-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>{outlet.location}</span>
            </div>
            <Badge className="bg-primary/10 text-primary border border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              {`< ${outlet.responseTime}`}
            </Badge>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-4">
            {outlet.specialties.slice(0,3).map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>

          <ContactButtons
            phone={outlet.phone}
            whatsapp={outlet.whatsapp}
            website={outlet.website}
          />
        </CardContent>
      </div>
    </Card>
  );
};

const ContactButtons = ({ phone, whatsapp, website }: { phone: string, whatsapp: string, website?: string }) => (
  <div className="grid grid-cols-3 gap-3">
    <Button
      onClick={() => window.open(`tel:${phone}`, '_self')}
      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:border-blue-500/50 transition-all"
      title="Call now"
    >
      <Phone className="w-4 h-4"/> Phone
    </Button>
    <Button
      onClick={() => window.open(`https://wa.me/${whatsapp}`, '_blank')}
      className="bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400 border border-green-500/30 hover:border-green-500/50 transition-all"
      title="WhatsApp chat"
    >
      <MessageCircle className="w-4 h-4"/> WhatsApp
    </Button>
    {website && (
      <Button
        onClick={() => window.open(website, '_blank')}
        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-400 border border-purple-500/30 hover:border-purple-500/50 transition-all"
        title="Visit website"
      >
        <Globe className="w-4 h-4"/> Website
      </Button>
    )}
  </div>
);

