"use client";
import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { JSX, useRef } from "react";
import Image from "next/image";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { CircleArrowDown } from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

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
  return (
    <>
      {/* Hero Section */}
      <section className="text-foreground h-screen w-full bg-background grid place-content-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[54px_54px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-center tracking-tight leading-[120%]">
            <TypingAnimation> Vote Your Way.</TypingAnimation>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-center opacity-70 mt-6 max-w-3xl mx-auto">
            Secure, transparent online voting for campus awards, student competitions, and events across Ghana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href={"/events"} className={"w-full md:w-fit"}>
              <Button size={"lg"} className={"px-8 w-full"}>
                BROWSE EVENTS
              </Button>
            </Link>
            <Link
              href="/nominations"
              className={"w-full md:w-fit"}
            >
             <Button variant={"secondary"} size={"lg"} className={"w-full"}>
               NOMINATE SOMEONE
             </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3 mt-12 opacity-40">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <CircleArrowDown size={32} strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stacking Cards Section — tracks its own scroll, independent of the hero */}
      <StackingSection />
    </>
  );
}

function StackingSection() {
  const container = useRef<HTMLDivElement>(null);

  /*
   * offset: ["start start", "end end"]
   *   0 → top of section hits top of viewport (first card sticky)
   *   1 → bottom of section hits bottom of viewport (last card fully scrolled)
   *
   * With N cards each h-screen:
   *   card i becomes sticky at progress = i / N
   *   so its scale range starts at i / N
   */
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container}>
      {benefits.map((benefit, i) => {
        /*
         * Last card (i = N-1) should NOT shrink → targetScale = 1
         * Each preceding card shrinks by 5% more than the next
         */
        const targetScale = 1 - (benefits.length - 1 - i) * 0.05;
        return (
          <BenefitCard
            key={`benefit_${i}`}
            i={i}
            url={benefit.link}
            src={benefit.src}
            title={benefit.title}
            color={benefit.color}
            description={benefit.description}
            progress={scrollYProgress}
            range={[i / benefits.length, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
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
    /*
     * h-screen + sticky top-0: each card occupies one viewport of scroll distance
     * and sticks to the top as the next card scrolls in on top of it.
     */
    <div
      ref={container}
      className="h-screen sticky top-0 flex items-center justify-center"
      style={{ zIndex: i + 1 }}
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          /*
           * Vertical stacking offset: each card is nudged down by 25px
           * so the stack edge of previous cards peeks out from beneath.
           */
          top: `${i * 25}px`,
        }}
        className="relative flex flex-col h-[450px] sm:h-[480px] md:h-[500px] w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] rounded-lg p-6 sm:p-8 md:p-10 origin-top"
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
