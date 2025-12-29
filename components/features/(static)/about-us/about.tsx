"use client";

import React from "react";
import {
  Trophy,
  Users,
  Vote,
  BarChart3,
  Target,
  Sparkles,
  CheckCircle2,
  Rocket,
  Award,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {AnimatedBackground} from "@/components/layout/animated-background";

const features = [
  {
    icon: Trophy,
    title: "Award Categories",
    description: "Create custom categories that fit your campus culture and values.",
  },
  {
    icon: Users,
    title: "Easy Nominations",
    description: "Students nominate peers who truly deserve recognition.",
  },
  {
    icon: Vote,
    title: "Monetary Voting",
    description: "Votes backed by money increase engagement and excitement.",
  },
  {
    icon: BarChart3,
    title: "Live Results",
    description: "Watch votes come in as anticipation builds toward award night.",
  },
];

const benefits = [
  {
    icon: CheckCircle2,
    title: "Transparent Process",
    description: "Every vote is tracked and verifiable. Our secure system maintains a complete audit trail, ensuring fairness and building trust across your entire campus community.",
  },
  {
    icon: TrendingUp,
    title: "Higher Engagement",
    description: "Students actively participate in celebrating peers. The monetary voting system creates meaningful involvement that transforms passive observers into active participants in campus culture.",
  },
  {
    icon: Award,
    title: "Fully Customizable",
    description: "Departments control all aspects of their awards. Set your own categories, voting periods, fee structures, and eligibility criteria to match your institution's unique needs and values.",
  },
];

const AboutPage = () => {
  return (
    <section className="relative overflow-hidden ">
      <AnimatedBackground />
      <div className="relative z-10  space-y-14">
        <div>
          <div className="text-center mx-auto space-y-4">
            <Badge variant="secondary" className="mb-2">About ANN</Badge>
            <h1 className="feature-header">
              Aims Achievers Network
            </h1>
            <p className="feature-subheader">
              Making campus award nights fair, exciting, and memorable.
            </p>
          </div>
        </div>

        <div >
          <div className="mx-auto relative z-10">
            <Card className="rounded-card border-border">
              <CardContent className="pt-8 space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                    Recognition Done Right
                  </h2>
                  <div className="space-y-4 text-base md:text-lg text-foreground">
                    <p>
                      {`Campus award nights matter. They celebrate achievement, inspire excellence, and build community.
                        But too often, they're held back by outdated processes and limited participation. Traditional
                        award systems rely on manual tallying, paper-based voting, or closed-door committee decisions that
                        leave students feeling disconnected from the process.`}
                    </p>
                    <p>
                      {`ANN changes this. We built a platform where students vote for their peers using money, making
                        every award feel earned and every ceremony feel electric. This approach creates real investment in
                        the outcome, both literally and emotionally. When students put their money behind a nominee,
                        they're not just clicking a button, they're making a statement about who truly deserves
                        recognition. Departments get full control over categories, timelines, and rules while maintaining
                        complete transparency through real-time vote tracking and verifiable results.`}
                    </p>
                    <p>
                      {`We started with universities because that's where we saw the need. Campus communities are vibrant
                        ecosystems where recognition can genuinely impact someone's experience and future opportunities.
                        But this platform can go anywhere recognition matters, from corporate excellence awards to
                        community leadership programs, professional associations to creative industry showcases.`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div >
          <div className="space-y-8">
            <div className="text-center  mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                How It Works
              </h2>
              <p className="feature-subheader">
                Simple tools for running award programs that students actually care about.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} >
                    <Card className="rounded-card h-full group hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div
                          className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-7 h-7 text-primary"/>
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        {feature.description}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
            <Card className="rounded-card bg-primary text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6" />
                  <CardTitle className="text-xl">Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative text-base leading-relaxed opacity-95">
                Build a platform that makes recognition meaningful, transparent, and accessible to every campus community.
              </CardContent>
            </Card>

            <Card className="rounded-card bg-secondary text-secondary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-foreground/10 rounded-full blur-3xl" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <CardTitle className="text-xl">Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative text-base leading-relaxed">
                Become the go-to platform for recognition systems, starting with campuses and scaling to organizations worldwide.
              </CardContent>
            </Card>
          </div>
        </div>

        <div >
          <div className="mx-auto">
            <Card className="rounded-card">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-primary">
                  Why Students and Departments Choose ANN
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {benefits.map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={idx} >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <div className=" mx-auto">
            <Card className="rounded-card bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Rocket className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-primary mb-2">
                      {`What's Next`}
                    </CardTitle>
                    <CardContent className="p-0 text-base md:text-lg text-foreground leading-relaxed">
                      {`We're expanding beyond campus awards. Corporate teams, professional associations, and community groups all need better ways to recognize excellence. The same challenges that exist in universities, lack of transparency, low engagement, outdated processes, exist everywhere recognition matters. ANN is built to scale, and we're ready to grow with any organization that values fair, engaging recognition. Whether you're running employee of the month programs, industry awards, or community recognition initiatives, our platform adapts to your needs while maintaining the core principles of transparency and authentic participation.`}
                    </CardContent>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;