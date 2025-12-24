'use client';

import {StepComponentProps} from '@/components/features/nominations';
import FormTextarea from "@/components/builders/form-textarea";

export const NominationDetailsStep = (
  {
    formData,
    onChange,
  }: StepComponentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="feature-header">Nomination Details</h2>
        <p className="feature-subheader">
          Tell us why this person deserves recognition
        </p>
      </div>

      <FormTextarea
        id="nominationReason"
        label="Why are you nominating this person?"
        name="nominationReason"
        value={formData.nominationReason}
        placeholder="Describe the main reason for this nomination..."
        required
        rows={5}
        onChange={onChange}
      />

      <FormTextarea
        id="achievements"
        label="Key Achievements"
        name="achievements"
        value={formData.achievements}
        placeholder="List specific achievements and accomplishments..."
        rows={5}
        onChange={onChange}
      />
    </div>
  );
};
