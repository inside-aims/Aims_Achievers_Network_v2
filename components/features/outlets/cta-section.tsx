'use client';

import {ArrowRight, Award, Check} from "lucide-react";
import {Button} from "@/components/ui/button";

export const CTASection = () => (
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 text-center">
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/20 border border-border backdrop-blur mb-8">
        <Award className="w-6 h-6 text-secondary" />
        <span className="text-foreground font-bold text-base md:text-lg">Join The Elite</span>
      </div>

      <h2 className="text-3xl md:text-6xl font-black text-foreground mb-2 md:mb-6">
        Are You A Master<br />
        <span className="text-secondary">Craftsman?</span>
      </h2>

      <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-12 max-w-3xl mx-auto">
        {`Join Ghana's most prestigious network of award vendors. Get discovered by thousands of clients.`}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          size="lg"
          className={"w-full md:w-fit"}
          onClick={() => ''} //fix later
        >
          Become a Partner
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className={"w-full md:w-fit border border "}
          onClick={() => ''} //fix later
        >
          Learn More
        </Button>
      </div>

      {/* Trust Elements */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl  mt-4 md:mt-8">
        {[
          { text: 'No listing fees' },
          { text: 'Premium exposure' },
          { text: 'Direct client access' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-start md:justify-center gap-2 text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
