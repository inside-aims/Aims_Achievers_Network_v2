'use client';
import {CheckCircle} from "lucide-react";
import {Step} from "@/components/features/nominations/index";

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export const ProgressSteps = ({ currentStep, steps }: ProgressStepsProps) => {
  return (
    <div >
      <div className="flex justify-between items-center relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border -z-10">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isCompleted ? 'bg-primary text-primary-foreground' :
                  isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    'bg-card border-2 border-border text-muted-foreground'
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
