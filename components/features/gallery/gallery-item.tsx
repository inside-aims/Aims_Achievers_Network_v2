"use client";

import {Calendar, Camera, MapPin, ZoomIn} from "lucide-react";
import {PhotoProps} from "@/components/features/gallery/index";
import {Card} from "@/components/ui/card";
import Image from "next/image";

interface GalleryItemProps {
  photo: PhotoProps
  onClick: () => void;
}

export default function GalleryItem({photo, onClick}: GalleryItemProps) {
  return (
    <Card
      key={photo.id}
      className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 bg-card hover:border p-0 gap-0"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={photo.url[0]}
          alt={photo.description}
          height={50}
          width={50}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card-foreground/80 via-card-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <ZoomIn className="w-4 h-4"/>
              <span className="text-sm font-medium">Click to view full size</span>
            </div>
          </div>
        </div>
      </div>

      <div className={"flex flex-col gap-2 p-4 border"}>
        <p className="px-2 border text-primary-foreground w-fit rounded-md bg-primary/50 hover:bg-primary/60">
          {photo.category}
        </p>

        <p className={"font-semibold"}>
          {photo.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/60"/>
            <span>{photo.eventName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary/60"/>
            <span>{photo.university}</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary/60"/>
            <span>{photo.photographer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/60"/>
            <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
