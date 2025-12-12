import {PhotoProps} from "@/components/features/gallery/index";
import {Button} from "@/components/ui/button";

interface Props {
  photos: PhotoProps[];
  setSelectedCategory: (v: string) => void;
}

export default function CategoryBadges({ photos, setSelectedCategory }: Props) {
  const unique = Array.from(new Set(photos.map((p) => p.category)));

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {unique.slice(0,2).map((cat) => (
        <Button
          key={cat}
          variant={"secondary"}
          onClick={() => setSelectedCategory(cat)}
          className="px-4 py-2 rounded-full text-sm"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
