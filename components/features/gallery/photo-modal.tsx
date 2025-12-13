"use client";

import Image from "next/image";
import {PhotoProps} from "@/components/features/gallery/index";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Calendar, Camera, MapPin} from "lucide-react";

interface Props {
  selectedPhoto: PhotoProps;
  setSelectedPhoto: (v: PhotoProps) => void;
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
}

export default function PhotoModal(
  {
    selectedPhoto,
    setSelectedPhoto,
    openModal,
    setOpenModal,
  }: Props) {

  return (
    <Dialog open={openModal} onOpenChange={() => {
      setOpenModal(openModal);
      setSelectedPhoto(null);
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedPhoto.description}</DialogTitle>
        </DialogHeader>

        <Carousel className="relative w-full">
          <CarouselContent className={"p-0"}>
            {selectedPhoto.url.map((photo, index) => (
              <CarouselItem key={`modal-photo-${index}`} className={""}>
                <Image
                  src={photo}
                  alt={`photo-${index}`}
                  width={900}
                  height={600}
                  className="rounded-lg mb-2 object-cover w-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 rounded-full shadow-md bg-popover/80 hover:bg-popover backdrop-blur"/>
          <CarouselNext
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 rounded-full shadow-md bg-popover/80 hover:bg-popover backdrop-blur"/>
        </Carousel>

        <div className="grid grid-cols-2 gap-2  font-semibold text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/60"/>
            <span>{selectedPhoto.eventName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary/60"/>
            <span>{selectedPhoto.university}</span>
          </div>
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary/60"/>
            <span>{selectedPhoto.photographer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/60"/>
            <span>{new Date(selectedPhoto.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
