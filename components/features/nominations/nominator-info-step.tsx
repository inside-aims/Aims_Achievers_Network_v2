import {StepComponentProps} from '@/components/features/nominations';
import FormInput from "@/components/builders/form-input";
import FormSelect from "@/components/builders/form-select";

export const NominatorInfoStep = (
  {
    formData,
    onChange,
    onSelectChange,
  }: StepComponentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="feature-header">Your Information</h2>
        <p className="feature-subheader">Tell us who you are</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <FormInput
          id="nominatorName"
          label="Full Name"
          name="nominatorName"
          value={formData.nominatorName}
          placeholder="John Doe"
          required
          onChange={onChange}
        />

        <FormInput
          id="nominatorEmail"
          label="Email Address"
          name="nominatorEmail"
          type="email"
          value={formData.nominatorEmail}
          placeholder="john@university.edu"
          required
          onChange={onChange}
        />

        <FormInput
          id="nominatorPhone"
          label="Phone Number"
          name="nominatorPhone"
          type="tel"
          value={formData.nominatorPhone}
          placeholder="+233 XX XXX XXXX"
          onChange={onChange}
        />

        <FormSelect
          id="nominatorRelationship"
          label="Your Relationship to Nominee"
          value={formData.nominatorRelationship}
          placeholder="Select relationship"
          required
          onChange={(value) =>
            onSelectChange?.('nominatorRelationship', value)
          }
          options={[
            {label: 'Fellow Student', value: 'peer'},
            {label: 'Faculty Member', value: 'faculty'},
            {label: 'Mentor', value: 'mentor'},
            {label: 'Supervisor', value: 'supervisor'},
            {label: 'Other', value: 'other'},
          ]}
        />
      </div>
    </div>
  );
};
