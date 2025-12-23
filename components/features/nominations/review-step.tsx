'use client';

import {Award, FileText, User, Users} from "lucide-react";
import {StepFormData} from "@/components/features/nominations/index";
import Image from 'next/image';

export const ReviewStep = ({ formData }: { formData: StepFormData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="feature-header">Review Your Nomination</h2>
        <p className="feature-subheader">
          Please review all information before submitting
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-card p-2 md:p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary"/>
            Nominator Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">
              Name: </span>
              <span className="font-medium text-foreground">
                {formData.nominatorName}
              </span>
            </div>
            <div><span className="text-muted-foreground">
              Email: </span>
              <span className="font-medium text-foreground">
                {formData.nominatorEmail}
              </span>
            </div>
            <div><span className="text-muted-foreground">
              Relationship: </span>
              <span className="font-medium text-foreground">
                {formData.nominatorRelationship}
              </span></div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-card p-2 md:p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Award className="w-5 h-5 mr-2 text-primary"/>
            Event & Category
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">
              Event: </span>
              <span className="font-medium text-foreground">
                {formData.eventName}
              </span>
            </div>
            <div><span className="text-muted-foreground">
              Category: </span>
              <span className="font-medium text-foreground">
                {formData.eventCategory}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-card p-2 md:p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary"/>
            Nominee Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">
              Name: </span><span className="font-medium text-foreground">
               {formData.nomineeName}
            </span></div>
            <div><span className="text-muted-foreground">
              Phone: </span> <span className="font-medium text-foreground">
              {formData.nomineePhone}
            </span></div>
            <div><span className="text-muted-foreground">
              Department: </span>
              <span className="font-medium text-foreground">
                {formData.nomineeDepartment}
              </span></div>
            <div><span className="text-muted-foreground">
              Program: </span>
              <span className="font-medium text-foreground">
              {formData.nomineeProgram}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Photo: </span>
              {formData.nomineePhoto instanceof File ? (
                <Image
                  src={URL.createObjectURL(formData.nomineePhoto)}
                  alt="Nominee preview"
                  height={50}
                  width={50}
                  className="w-32 h-32 object-cover rounded-lg border border-border"
                />
              ) : (
                <span className="font-medium text-foreground">No file selected</span>
              )}
            </div>
          </div>
        </div>


        <div className="bg-muted/50 rounded-card p-2 md:p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary"/>
            Nomination Details
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground font-medium">
                Reason: </span>
              <p className="mt-1 text-foreground">
                {formData.nominationReason}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
