'use client';

import { useState, ChangeEvent } from 'react';
import { ChevronRight, ChevronLeft, Award, Users, FileText, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {Step, StepFormData} from "@/components/features/nominations/index";
import {NominatorInfoStep} from "@/components/features/nominations/nominator-info-step";
import {ProgressSteps} from "@/components/features/nominations/progress-steps";
import {NomineeInfoStep} from "@/components/features/nominations/nominee-info-step";
import {EventSelectionStep} from "@/components/features/nominations/event-selection-step";
import {NominationDetailsStep} from "@/components/features/nominations/nomination-details-step";
import {ReviewStep} from "@/components/features/nominations/review-step";
import { toast } from "sonner"
import {EVENTS} from "@/components/features/events";
import {getDaysLeft} from "@/lib/utils";

interface NavigationButtonsProps {
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isStepValid: () => boolean;
}

//Stepper indicator
const steps: Step[] = [
  { number: 1, title: 'Your Info', icon: User },
  { number: 2, title: 'Event', icon: Award },
  { number: 3, title: 'Nominee', icon: Users },
  { number: 4, title: 'Details', icon: FileText },
  { number: 5, title: 'Review', icon: CheckCircle }
];

const NominationProcess = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<StepFormData>({
    nominatorName: '',                          //nominator
    nominatorEmail: '',
    nominatorPhone: '',
    nominatorRelationship: '',
    eventName: '',                                     //event selection
    eventCategory: '',
    nomineeName: '',                                    //nominee
    nomineePhone: '',
    nomineeDepartment: '',
    nomineeYear: '',
    nomineeProgram: '',
    nomineePhoto: null as File | null,
    nominationReason: '',                                   //reason
    achievements: '',
  });

  const events = EVENTS
    .filter((event) => getDaysLeft(event.endDate) > 0)
    .map((event) => ({
      label: event.title,
      value: event.eventId
    }));

  // Get categories based on selected event
  const getCategories = () => {
    if (!formData.eventName) return [];

    const selectedEvent = EVENTS.find(event => event.eventId === formData.eventName);

    if (!selectedEvent) return [];

    return selectedEvent.categories.map(category => ({
      label: category.name,
      value: category.id
    }));
  };

  const categories = getCategories();

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if ('files' in e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  //Handle input type file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));
    }
  };

  //Handle select input
  const handleSelectChange = (name: keyof StepFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Forward or next step navigation
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  //Previous or back step navigation
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Nomination submitted:', formData);
    toast.success('Nomination submitted successfully!');

    setFormData({
      nominatorName: '',
      nominatorEmail: '',
      nominatorPhone: '',
      nominatorRelationship: '',
      eventName: '',
      eventCategory: '',
      nomineeName: '',
      nomineePhone: '',
      nomineeDepartment: '',
      nomineeYear: '',
      nomineeProgram: '',
      nomineePhoto: null,
      nominationReason: '',
      achievements: '',
    });
    setCurrentStep(1);
  };

  // Validation helper. Enable next button only when required input is provided
  const isStepValid = (): boolean => {
    switch(currentStep) {
      case 1:
        return !!(formData.nominatorName && formData.nominatorEmail && formData.nominatorRelationship );
      case 2:
        return  !!(formData.eventName && formData.eventCategory);
      case 3:
        return !!(formData.nomineeName && formData.nomineeDepartment && formData.nomineeYear && formData.nomineePhone && formData.nomineeProgram && formData.nomineePhoto);
      case 4:
        return !!(formData.nominationReason);
      default:
        return true;
    }
  };

  //Render form base on  the current step
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <NominatorInfoStep formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} />;
      case 2:
        return <EventSelectionStep formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} events={events} categories={categories} />;
      case 3:
       return <NomineeInfoStep formData={formData} onChange={handleInputChange} onSelectChange={handleSelectChange} onFileChange={handleFileChange}
       />;
      case 4:
        return <NominationDetailsStep formData={formData} onChange={handleInputChange} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
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

        <div className="flex flex-col gap-4 md:gap-8 bg-card rounded-card shadow-lg p-2 md:p-4  border border-border">
          {renderStep()}

          <NavigationButtons
            currentStep={currentStep}
            onPrev={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
            isStepValid={isStepValid}
          />
        </div>
      </div>
    </div>
  );
};

export default NominationProcess;


const NavigationButtons = ({ currentStep, onPrev, onNext, onSubmit, isStepValid }: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        onClick={onPrev}
        disabled={currentStep === 1}
        variant="secondary"
        size="lg"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Previous
      </Button>

      {currentStep < 5 ? (
        <Button
          onClick={onNext}
          disabled={!isStepValid()}
          size="lg"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          size="lg"
          className="px-8"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Submit Nomination
        </Button>
      )}
    </div>
  );
};
