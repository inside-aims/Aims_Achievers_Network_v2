import React from 'react'
import { Metadata } from 'next'
import AboutUs from "@/components/features/(static)/about-us/about";
import {BubbleBackground} from "@/components/ui/shadcn-io/bubble-background";

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn more about our mission, vision, and the people behind the platform, dedicated to recognizing excellence and driving meaningful impact.',
}

type ColorConfig = {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
}

const colors: ColorConfig = {
  first: "82,65,138",        // Primary color from your CSS (oklch converted to RGB)
  second: "226,183,92",      // Secondary color from your CSS
  third: "130,103,181",      // Muted color variant
  fourth: "191,157,75",      // Secondary darker variant
  fifth: "150,115,200",      // Accent purple
  sixth: "200,170,100"       // Accent gold
}

const AboutUsPage = () => {
  return (
      <BubbleBackground
        interactive={false}
        colors={colors}
        transition={{stiffness: 100, damping: 20}}
      >
      <div id="about" className="feature">
        <AboutUs/>
      </div>
      </BubbleBackground>
  )
}

export default AboutUsPage
