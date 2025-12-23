import {ChangeEvent} from "react";

export interface Step {
  number: number;
  title: string;
  icon: React.ElementType;
}

export interface StepFormData {
  //nominator fields
  nominatorName: string;
  nominatorEmail: string;
  nominatorPhone: string;
  nominatorRelationship: string;

  //event selection fields
  eventName: string;
  eventCategory: string;

  //nominee fields
  nomineeName: string;
  nomineePhone: string;
  nomineeDepartment: string;
  nomineeYear: string;
  nomineeProgram: string;
  nomineePhoto: File | null;

  nominationReason: string;
  achievements: string;
}

export interface StepComponentProps {
  formData: StepFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (name: keyof StepFormData, value: string) => void;
}