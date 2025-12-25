import { Camera } from "lucide-react";

export default function GalleryHero() {
  return (
    <section className="w-full py-12 md:py-20 px-4 bg-[linear-gradient(135deg,var(--muted-foreground)_0%,var(--accent)_100%)] text-foreground">
      <div className="max-w-7xl mx-auto text-center space-y-6">

        <div
          className="inline-flex items-center justify-center w-20 h-20
          bg-primary-foreground/10 backdrop-blur-sm rounded-full">
          <Camera className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold">
          Event Gallery
        </h1>

        <p className="text-lg md:text-xl opacity-90">
          Capturing Unforgettable Moments
        </p>

        <p className="text-md md:text-lg max-w-3xl mx-auto opacity-80">
          Explore stunning event photography from universities across the region.
        </p>

      </div>
    </section>
  );
}
