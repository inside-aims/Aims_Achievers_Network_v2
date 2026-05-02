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

export type Program = { label: string; value: string };
export type Department = { label: string; value: string; programs: Program[] };

export const DEPARTMENTS: Department[] = [
  {
    label: 'Faculty of Engineering',
    value: 'faculty-of-engineering',
    programs: [
      { label: 'BSc Computer Engineering', value: 'bsc-computer-engineering' },
      { label: 'BSc Electrical Engineering', value: 'bsc-electrical-engineering' },
      { label: 'BSc Mechanical Engineering', value: 'bsc-mechanical-engineering' },
      { label: 'BSc Civil Engineering', value: 'bsc-civil-engineering' },
      { label: 'BSc Chemical Engineering', value: 'bsc-chemical-engineering' },
    ],
  },
  {
    label: 'Faculty of Computing and Information Systems',
    value: 'faculty-of-computing',
    programs: [
      { label: 'BSc Computer Science', value: 'bsc-computer-science' },
      { label: 'BSc Information Technology', value: 'bsc-information-technology' },
      { label: 'BSc Cyber Security', value: 'bsc-cyber-security' },
      { label: 'BSc Data Science', value: 'bsc-data-science' },
      { label: 'BSc Software Engineering', value: 'bsc-software-engineering' },
    ],
  },
  {
    label: 'Faculty of Business Administration',
    value: 'faculty-of-business',
    programs: [
      { label: 'BSc Business Administration', value: 'bsc-business-administration' },
      { label: 'BSc Accounting', value: 'bsc-accounting' },
      { label: 'BSc Marketing', value: 'bsc-marketing' },
      { label: 'BSc Human Resource Management', value: 'bsc-human-resource-management' },
      { label: 'BSc Finance', value: 'bsc-finance' },
    ],
  },
  {
    label: 'Faculty of Social Sciences',
    value: 'faculty-of-social-sciences',
    programs: [
      { label: 'BA Sociology', value: 'ba-sociology' },
      { label: 'BA Psychology', value: 'ba-psychology' },
      { label: 'BA Political Science', value: 'ba-political-science' },
      { label: 'BA Economics', value: 'ba-economics' },
      { label: 'BA Communication Studies', value: 'ba-communication-studies' },
    ],
  },
  {
    label: 'Faculty of Natural Sciences',
    value: 'faculty-of-natural-sciences',
    programs: [
      { label: 'BSc Biology', value: 'bsc-biology' },
      { label: 'BSc Chemistry', value: 'bsc-chemistry' },
      { label: 'BSc Physics', value: 'bsc-physics' },
      { label: 'BSc Mathematics', value: 'bsc-mathematics' },
      { label: 'BSc Environmental Science', value: 'bsc-environmental-science' },
    ],
  },
  {
    label: 'Faculty of Education',
    value: 'faculty-of-education',
    programs: [
      { label: 'BA Education (Mathematics)', value: 'ba-education-mathematics' },
      { label: 'BA Education (English)', value: 'ba-education-english' },
      { label: 'BA Education (Social Studies)', value: 'ba-education-social-studies' },
      { label: 'BA Early Childhood Education', value: 'ba-early-childhood-education' },
      { label: 'BSc Education (Science)', value: 'bsc-education-science' },
    ],
  },
  {
    label: 'Faculty of Arts and Humanities',
    value: 'faculty-of-arts',
    programs: [
      { label: 'BA English Language', value: 'ba-english-language' },
      { label: 'BA History', value: 'ba-history' },
      { label: 'BA Philosophy', value: 'ba-philosophy' },
      { label: 'BA Religious Studies', value: 'ba-religious-studies' },
      { label: 'BA French', value: 'ba-french' },
    ],
  },
  {
    label: 'Faculty of Health Sciences',
    value: 'faculty-of-health-sciences',
    programs: [
      { label: 'BSc Nursing', value: 'bsc-nursing' },
      { label: 'BSc Public Health', value: 'bsc-public-health' },
      { label: 'BSc Medical Laboratory Science', value: 'bsc-medical-laboratory-science' },
      { label: 'BSc Pharmacy', value: 'bsc-pharmacy' },
      { label: 'MB ChB Medicine and Surgery', value: 'mbchb-medicine-and-surgery' },
    ],
  },
];
