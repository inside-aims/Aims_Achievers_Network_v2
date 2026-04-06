"use client";

import { useState, ChangeEvent } from "react";
import { ChevronRight, ChevronLeft, Award, Users, FileText, CheckCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step, StepFormData } from "@/components/features/nominations/index";
import { NominatorInfoStep } from "@/components/features/nominations/nominator-info-step";
import { ProgressSteps } from "@/components/features/nominations/progress-steps";
import { NomineeInfoStep } from "@/components/features/nominations/nominee-info-step";
import { EventSelectionStep } from "@/components/features/nominations/event-selection-step";
import { NominationDetailsStep } from "@/components/features/nominations/nomination-details-step";
import { ReviewStep } from "@/components/features/nominations/review-step";
import { toast } from "sonner";
import { getDaysLeft } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEvents } from "@/hooks/use-events";
import { submitNomination } from "@/lib/types/nominations";

interface NavigationButtonsProps {
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isStepValid: () => boolean;
  isSubmitting: boolean;
}

const steps: Step[] = [
  { number: 1, title: "Your Info",  icon: User        },
  { number: 2, title: "Event",      icon: Award       },
  { number: 3, title: "Nominee",    icon: Users       },
  { number: 4, title: "Details",    icon: FileText    },
  { number: 5, title: "Review",     icon: CheckCircle },
];

const emptyForm: StepFormData = {
  nominatorName: "",
  nominatorEmail: "",
  nominatorPhone: "",
  nominatorRelationship: "",
  eventName: "",
  eventCategory: "",
  nomineeName: "",
  nomineePhone: "",
  nomineeDepartment: "",
  nomineeYear: "",
  nomineeProgram: "",
  nomineePhoto: null,
  nominationReason: "",
  achievements: "",
};

const NominationProcess = () => {
  const searchParams = useSearchParams();
  const eventIdParam    = searchParams.get("event");
  const categoryIdParam = searchParams.get("category");

  const { events, loading: eventsLoading } = useEvents();

  const getInitialStep = () => (eventIdParam && categoryIdParam ? 2 : 1);

  const [currentStep, setCurrentStep]   = useState<number>(getInitialStep());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData]         = useState<StepFormData>({
    ...emptyForm,
    eventName:     eventIdParam ?? "",
    eventCategory: categoryIdParam ?? "",
  });

  // Active events for dropdown (only those still open)
  const activeEventOptions = events
    .filter((e) => getDaysLeft(e.endDate) > 0)
    .map((e) => ({ label: e.title, value: e.eventId }));

  const getCategories = () => {
    if (!formData.eventName) return [];
    const selected = events.find((e) => e.eventId === formData.eventName);
    return (selected?.categories ?? []).map((c) => ({ label: c.name, value: c.id }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: e.target.files![0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, [e.target.name]: file }));
  };

  const handleSelectChange = (name: keyof StepFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => { if (currentStep < 5) setCurrentStep((s) => s + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitNomination(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Nomination submitted! The nominee has been added to the voting list.");
      setFormData({ ...emptyForm });
      setCurrentStep(1);
    } else {
      toast.error(result.error ?? "Submission failed. Please try again.");
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1: return !!(formData.nominatorName && formData.nominatorEmail && formData.nominatorRelationship);
      case 2: return !!(formData.eventName && formData.eventCategory);
      case 3: return !!(formData.nomineeName && formData.nomineeDepartment && formData.nomineeYear && formData.nomineePhone && formData.nomineeProgram && formData.nomineePhoto);
      case 4: return !!formData.nominationReason;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <NominatorInfoStep formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 2: return (
        <EventSelectionStep
          formData={formData}
          onChange={handleInputChange}
          onSelectChange={handleSelectChange}
          events={eventsLoading ? [] : activeEventOptions}
          categories={getCategories()}
        />
      );
      case 3: return <NomineeInfoStep formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} onFileChange={handleFileChange} />;
      case 4: return <NominationDetailsStep formData={formData} onChange={handleInputChange} />;
      case 5: return <ReviewStep formData={formData} />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 md:w-16 h-10 md:h-16 bg-primary rounded-card mb-4">
            <Award className="w-6 md:w-8 h-6 md:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
            Nominate a Deserving Peer
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Recognize excellence through our structured nomination process
          </p>
        </div>

        <ProgressSteps currentStep={currentStep} steps={steps} />

        <div className="flex flex-col gap-4 md:gap-8 bg-card rounded-card shadow-lg p-2 md:p-4 border border-border">
          {renderStep()}

          <NavigationButtons
            currentStep={currentStep}
            onPrev={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
            isStepValid={isStepValid}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default NominationProcess;

const NavigationButtons = ({
  currentStep,
  onPrev,
  onNext,
  onSubmit,
  isStepValid,
  isSubmitting,
}: NavigationButtonsProps) => (
  <div className="flex gap-3">
    <Button onClick={onPrev} disabled={currentStep === 1 || isSubmitting} variant="secondary" size="lg" className="flex-1">
      <ChevronLeft className="w-5 h-5 mr-2" />
      Previous
    </Button>

    {currentStep < 5 ? (
      <Button onClick={onNext} disabled={!isStepValid()} size="lg" className="flex-1">
        Next
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    ) : (
      <Button onClick={onSubmit} disabled={isSubmitting} size="lg" className="flex-1">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Submit Nomination
          </span>
        )}
      </Button>
    )}
  </div>
);
