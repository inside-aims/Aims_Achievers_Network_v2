'use client';

import {StepComponentProps} from "@/components/features/nominations/index";
import FormSelect from "@/components/builders/form-select";

interface EventSelectionStepProps extends StepComponentProps {
  events: {label: string, value: string}[];
  categories: {label: string, value: string}[];
}

export const EventSelectionStep = ({ formData, onSelectChange, events, categories }: EventSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="feature-header">Event Selection</h2>
        <p className="feature-subheader">Select the most appropriate award event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <FormSelect
          id="eventName"
          label="Select Event"
          value={formData.eventName}
          placeholder="Select your event"
          required
          onChange={(value) =>
            onSelectChange?.('eventName', value)
          }
          options={events}
        />
        <FormSelect
          id={'eventCategory'}
          label={"Select Category"}
          value={formData.eventCategory}
          required
          options={categories}
          onChange={(value) =>
          onSelectChange?.("eventCategory", value)}
        />
      </div>
    </div>
  );
};
