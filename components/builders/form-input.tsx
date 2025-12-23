'use client';

import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';

type FormInputProps = {
  id: string;
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "tel" | "file";
  required?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormInput = (
  {
    id,
    label,
    name,
    value,
    placeholder,
    type = 'text',
    required,
    className,
    onChange,
  }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Input
        id={id}
        name={name}
        type={type}
        {...(type !== "file" && { value })}
        placeholder={placeholder}
        onChange={onChange}
        className={cn(className, "border border-border h-10 md:h-11 items-center")}
      />
    </div>
  );
};

export default FormInput;
