"use client";

import GalleryItem from "@/components/features/gallery/gallery-item";
import {PhotoProps} from "@/components/features/gallery/index";

interface Props {
  photos: PhotoProps[];
  openPhoto: (photo: PhotoProps, i: number) => void;
}

export default function GalleryList({ photos, openPhoto }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {photos.map((p,index ) => (
        <GalleryItem
          key={p.id}
          photo={p}
          onClick={() => openPhoto(p, index)}
        />
      ))}
    </div>
  );
}