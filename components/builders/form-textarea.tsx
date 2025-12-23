'use client';

import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {cn} from '@/lib/utils';

type FormTextareaProps = {
  id: string;
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const FormTextarea = (
  {
    id,
    label,
    name,
    value,
    placeholder,
    rows = 4,
    required,
    className,
    onChange,
  }: FormTextareaProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Textarea
        id={id}
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={onChange}
        className={cn('resize-none border border-border', className)}
      />
    </div>
  );
};

export default FormTextarea;
