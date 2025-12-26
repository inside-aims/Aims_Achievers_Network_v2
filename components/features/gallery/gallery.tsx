"use client";

import React, { useState } from "react";
import {mockPhotos, events, categories, universities, PhotoProps} from "@/components/features/gallery/index";
import GalleryHero from "@/components/features/gallery/gallery-hero";
import GalleryStats from "@/components/features/gallery/gallery-stats";
import GalleryFilters from "@/components/features/gallery/gallery-filters";
import CategoryBadges from "@/components/features/gallery/category-badges";
import GalleryList from "@/components/features/gallery/gallery-list";
import {Button} from "@/components/ui/button";
import {Camera} from "lucide-react";
import {AnimatedBackground} from "@/components/layout/animated-background";
import dynamic from "next/dynamic";

const PhotoModal = dynamic(() => import("@/components/features/gallery/photo-modal"))

const Gallery = () => {
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedUniversity, setSelectedUniversity] = useState("All Universities");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoProps | null >(null);

  const filteredPhotos = mockPhotos.filter((photo) => {
    const matchesEvent = selectedEvent === "All Events" || photo.eventName === selectedEvent;

    const matchesCategory =
      selectedCategory === "All Categories" || photo.category === selectedCategory;

    const matchesUniversity =
      selectedUniversity === "All Universities" || photo.university === selectedUniversity;

    const matchesSearch =
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEvent && matchesCategory && matchesUniversity && matchesSearch;
  });

  const openPhoto = (photo: PhotoProps) => {
    setSelectedPhoto(photo);
    if(selectedPhoto !== null) {
      setOpenModal(true);
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground/>
      <GalleryHero />

      <GalleryStats
        total={mockPhotos.length}
        events={events.length - 1}
        categories={categories.length - 1}
        universities={universities.length - 1}
      />

      <div className="feature">
        <GalleryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedUniversity={selectedUniversity}
          setSelectedUniversity={setSelectedUniversity}
          events={events}
          categories={categories}
          universities={universities}
        />

        <CategoryBadges photos={filteredPhotos} setSelectedCategory={setSelectedCategory} />

        <GalleryList photos={filteredPhotos} openPhoto={openPhoto} />

        {filteredPhotos.length === 0 && (
          <div className="text-center">
            <Camera className="w-20 h-20 mx-auto text-gray-300 mb-6"/>
            <h3 className="text-2xl font-semibold text-muted-foreground mb-2">No photos found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
            <Button
              onClick={() => {
                setSelectedEvent("All Events");
                setSelectedCategory("All Categories");
                setSelectedUniversity("All Universities");
                setSearchQuery("");
              }}
              className={""}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal
          selectedPhoto={selectedPhoto}
          setSelectedPhoto={setSelectedPhoto}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
export default Gallery;