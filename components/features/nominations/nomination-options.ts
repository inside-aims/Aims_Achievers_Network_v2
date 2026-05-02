export type SelectOption = { label: string; value: string };

export const RELATIONSHIP_OPTIONS: SelectOption[] = [
  { label: 'Fellow Student', value: 'peer' },
  { label: 'Faculty Member', value: 'faculty' },
  { label: 'Mentor', value: 'mentor' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Other', value: 'other' },
];

export const YEAR_OPTIONS: SelectOption[] = [
  { label: 'Year 1', value: '1' },
  { label: 'Year 2', value: '2' },
  { label: 'Year 3', value: '3' },
  { label: 'Year 4', value: '4' },
  { label: 'Graduate', value: 'graduate' },
  { label: 'Other', value: 'other' },
];

export const getLabel = (options: SelectOption[], value: string): string =>
  options.find(o => o.value === value)?.label ?? value;
