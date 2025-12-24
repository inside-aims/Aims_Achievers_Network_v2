'use client';

import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = {
  label: string;
  value: string;
};

type FormSelectProps = {
  id: string;
  label: string;
  value?: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  onChange: (value: string) => void;
};

const FormSelect = (
  {
    id,
    label,
    value,
    placeholder = 'Select option',
    options,
    required,
    onChange,
  }: FormSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full border border-border py-5">
          <SelectValue placeholder={placeholder}/>
        </SelectTrigger>

        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormSelect;
