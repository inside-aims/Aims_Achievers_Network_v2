// StackingCardsHero.tsx
"use client";
import { ReactLenis } from "lenis/react";
import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { JSX, useRef } from "react";
import Image from "next/image";
import ShiningButton from "../ShinningButton";

// Update these with your platform's benefits and services
const benefits = [
  {
    title: "Career Development",
    description:
      "Access personalized mentorship programs, skill-building workshops, and career guidance from industry professionals to accelerate your professional growth.",
    src: "career.jpg",
    link: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    color: "#5196fd",
  },
  {
    title: "Networking Opportunities",
    description:
      "Connect with like-minded professionals, entrepreneurs, and mentors. Build meaningful relationships that open doors to new opportunities.",
    src: "networking.jpg",
    link: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    color: "#8f89ff",
  },
  {
    title: "Resource Library",
    description:
      "Unlimited access to curated resources, courses, templates, and tools designed to help you achieve your goals faster and more efficiently.",
    src: "resources.jpg",
    link: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80",
    color: "#13006c",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of achievers who support, inspire, and celebrate each other's successes. You're never alone on your journey.",
    src: "community.jpg",
    link: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
    color: "#ed649e",
  },
  {
    title: "Exclusive Events",
    description:
      "Get invited to exclusive workshops, seminars, and networking events featuring industry leaders and successful entrepreneurs.",
    src: "events.jpg",
    link: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    color: "#fd521a",
  },
];

export default function StackingCardsHero(): JSX.Element {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main className="bg-background" ref={container}>
        {/* Hero Section */}
        <section className="text-foreground h-screen w-full bg-background grid place-content-center relative overflow-hidden">
          {/* Animated grid background */}
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          <div className="relative z-10 px-4 sm:px-6 md:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-center tracking-tight leading-[120%]">
              Vote Your Way
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-center opacity-70 mt-6 max-w-3xl mx-auto">
              Discover the benefits and services designed to help you achieve
              your goals
            </p>
            <div className="flex justify-center mt-8">
              <div className="text-sm tracking-widest opacity-40 animate-bounce">
                Scroll to explore features ↓
              </div>
            </div>
          </div>
        </section>

        {/* Stacking Cards Section */}
        <section className="text-foreground w-full">
          {benefits.map((benefit, i) => {
            const targetScale = 1 - (benefits.length - i) * 0.05;
            return (
              <BenefitCard
                key={`benefit_${i}`}
                i={i}
                url={benefit?.link}
                src={benefit?.src}
                title={benefit?.title}
                color={benefit?.color}
                description={benefit?.description}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>

        <section className="">
          <div className="py-20 px-4 sm:px-6 md:px-8">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-center tracking-tight leading-[100%] text-white/90 mb-8">
              Ready to Start?
            </h2>
            <div className="flex justify-center">
              <ShiningButton className="" label="View Events" />
            </div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
}

interface BenefitCardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative -top-[25%] h-[400px] sm:h-[450px] md:h-[500px] w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 origin-top"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-wide mb-4 sm:mb-6">
          {title}
        </h2>
        <div className="flex flex-col lg:flex-row h-full gap-6 lg:gap-10">
          <div className="lg:w-[40%] flex flex-col justify-between">
            <p className="text-sm sm:text-base font-light leading-relaxed opacity-90">
              {description}
            </p>
            <span className="flex items-center gap-2 mt-4 lg:mt-0">
              <a
                href="#"
                className="text-sm sm:text-base font-light tracking-wide hover:tracking-wider transition-all duration-300 flex items-center gap-2 group"
              >
                Learn more
                <svg
                  width="22"
                  height="12"
                  viewBox="0 0 22 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path
                    d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </span>
          </div>

          <div className="relative lg:w-[60%] h-48 sm:h-64 lg:h-full rounded-lg overflow-hidden">
            <motion.div className="w-full h-full" style={{ scale: imageScale }}>
              <Image
                fill
                src={url}
                alt={title}
                className="object-cover"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
