import Gallery from "@/components/features/gallery/gallery";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Explore highlights from past award ceremonies, events, and memorable moments celebrating excellence and achievement.',
}

const GalleryPage = () => {
  return(
    <div id={"gallery"} className={"!feature"}>
      <Gallery/>
    </div>
  )
}
export default GalleryPage