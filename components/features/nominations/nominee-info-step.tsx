'use client';

import {StepComponentProps} from '@/components/features/nominations';
import FormInput from "@/components/builders/form-input";
import FormSelect from "@/components/builders/form-select";

interface NomineeInfoStepProps  extends StepComponentProps {
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

}
export const NomineeInfoStep = (
  {
    formData,
    onChange,
    onSelectChange,
    onFileChange
  }: NomineeInfoStepProps) => {
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

        <FormInput
          id="nomineeDepartment"
          label="Department / Faculty"
          name="nomineeDepartment"
          value={formData.nomineeDepartment}
          placeholder="Engineering"
          required
          onChange={onChange}
        />

        <FormSelect
          id="nomineeYear"
          label="Year / Level"
          value={formData.nomineeYear}
          placeholder="Select year"
          required
          onChange={(value) =>
            onSelectChange?.('nomineeYear', value)
          }
          options={[
            {label: 'Year 1', value: '1'},
            {label: 'Year 2', value: '2'},
            {label: 'Year 3', value: '3'},
            {label: 'Year 4', value: '4'},
            {label: 'Graduate', value: 'graduate'},
            {label: "Other", value: 'other'}
          ]}
        />

        <FormInput
          id="nomineeProgram"
          label="Program / Course"
          name="nomineeProgram"
          required
          value={formData.nomineeProgram}
          placeholder="BSc Computer Science"
          onChange={onChange}
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
