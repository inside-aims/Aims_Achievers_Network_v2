'use client';

import {DEPARTMENTS, StepComponentProps} from '@/components/features/nominations';
import FormInput from "@/components/builders/form-input";
import FormSelect from "@/components/builders/form-select";
import {YEAR_OPTIONS} from "@/components/features/nominations/nomination-options";

interface NomineeInfoStepProps extends StepComponentProps {
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NomineeInfoStep = (
  {
    formData,
    onChange,
    onSelectChange,
    onFileChange
  }: NomineeInfoStepProps) => {

  const departmentOptions = DEPARTMENTS.map(({ label, value }) => ({ label, value }));

  // program select
  const programOptions =
    DEPARTMENTS.find(d => d.value === formData.nomineeDepartment)?.programs ?? [];

  const handleDepartmentChange = (value: string) => {
    onSelectChange?.('nomineeDepartment', value);
    // Reset program whenever department changes
    onSelectChange?.('nomineeProgram', '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="feature-header">Nominee Information</h2>
        <p className="feature-subheader">Who are you nominating?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="nomineeName"
          label="Full Name"
          name="nomineeName"
          value={formData.nomineeName}
          placeholder="Jane Smith"
          required
          type={"text"}
          onChange={onChange}
        />

        <FormInput
          id="nomineePhone"
          label="Phone Number"
          name="nomineePhone"
          required
          type="tel"
          value={formData.nomineePhone}
          placeholder="+233 XX XXX XXXX"
          onChange={onChange}
        />

        <FormSelect
          id="nomineeDepartment"
          label="Department / Faculty"
          value={formData.nomineeDepartment}
          placeholder="Select department / faculty"
          required
          onChange={handleDepartmentChange}
          options={departmentOptions}
        />

        <FormSelect
          id="nomineeYear"
          label="Year / Level"
          value={formData.nomineeYear}
          placeholder="Select year"
          required
          onChange={(value) => onSelectChange?.('nomineeYear', value)}
          options={YEAR_OPTIONS}
        />

        <FormSelect
          id="nomineeProgram"
          label="Program / Course"
          value={formData.nomineeProgram}
          placeholder={
            formData.nomineeDepartment
              ? 'Select program / course'
              : 'Select a department / faculty first'
          }
          required
          onChange={(value) => onSelectChange?.('nomineeProgram', value)}
          options={programOptions}
          disabled={!formData.nomineeDepartment}
        />

        <FormInput
          id="nomineePhoto"
          label="Photo/Picture"
          name="nomineePhoto"
          required
          type="file"
          onChange={onFileChange || onChange}
        />
      </div>
    </div>
  );
};
