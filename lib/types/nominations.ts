import { supabase } from "@/lib/supabase";
import type { StepFormData } from "@/components/features/nominations";

export interface SubmitResult {
  success: boolean;
  error?: string;
}

export async function submitNomination(formData: StepFormData): Promise<SubmitResult> {
  try {
    // 1. Upload nominee photo to storage (if provided)
    let photoUrl: string | null = null;
    if (formData.nomineePhoto) {
      const ext = formData.nomineePhoto.name.split(".").pop() ?? "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("nominee-photos")
        .upload(fileName, formData.nomineePhoto, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(`Photo upload failed: ${uploadError.message}`);

      const { data: publicData } = supabase.storage
        .from("nominee-photos")
        .getPublicUrl(uploadData.path);

      photoUrl = publicData.publicUrl;
    }

    // 2. Insert into nominations table
    const { error: nomError } = await supabase.from("nominations").insert({
      nominator_name:        formData.nominatorName,
      nominator_email:       formData.nominatorEmail,
      nominator_phone:       formData.nominatorPhone || null,
      nominator_relationship: formData.nominatorRelationship,
      event_id:              formData.eventName,
      category_id:           formData.eventCategory,
      nominee_name:          formData.nomineeName,
      nominee_phone:         formData.nomineePhone || null,
      nominee_department:    formData.nomineeDepartment || null,
      nominee_year:          formData.nomineeYear || null,
      nominee_program:       formData.nomineeProgram || null,
      nominee_photo_url:     photoUrl,
      nomination_reason:     formData.nominationReason,
      achievements:          formData.achievements || null,
      status:                "pending",
    });

    if (nomError) throw new Error(`Nomination save failed: ${nomError.message}`);

    // 3. Auto-insert nominee record so they appear in the voting list immediately
    const nomineeId   = `${formData.eventCategory}-${Date.now()}`;
    const prefix      = formData.eventCategory.substring(0, 4).toUpperCase();
    const nomineeCode = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const { error: nomineeError } = await supabase.from("nominees").insert({
      nominee_id:   nomineeId,
      nominee_code: nomineeCode,
      category_id:  formData.eventCategory,
      event_id:     formData.eventName,
      full_name:    formData.nomineeName,
      phone:        formData.nomineePhone || null,
      department:   formData.nomineeDepartment || null,
      year:         formData.nomineeYear || null,
      program:      formData.nomineeProgram || null,
      image_url:    photoUrl,
      description:  formData.nominationReason.substring(0, 200),
      votes:        0,
      is_active:    true,
    });

    if (nomineeError) throw new Error(`Nominee creation failed: ${nomineeError.message}`);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Submission failed. Please try again.",
    };
  }
}
