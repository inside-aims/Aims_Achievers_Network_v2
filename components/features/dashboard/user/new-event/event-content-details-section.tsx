"use client"

import { useFieldArray, type Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { RepeatableFieldGroup } from "@/components/shared/repeatable-field-group"
import { type NewEventFormValues } from "./new-event-schema"

interface Props {
  control: Control<NewEventFormValues>
}

export function EventContentDetailsSection({ control }: Props) {
  const agenda      = useFieldArray({ control, name: "agenda" })
  const lineup      = useFieldArray({ control, name: "lineup" })
  const socialLinks = useFieldArray({ control, name: "socialLinks" })
  const faqs        = useFieldArray({ control, name: "faqs" })
  const sponsors    = useFieldArray({ control, name: "sponsors" })

  return (
    <div className="form-section">
      <div>
        <h2 className="form-section-title">Event Details</h2>
        <p className="form-section-desc">
          Agenda, lineup, policies, and contact info shown to ticket buyers and voters on the public event page.
        </p>
      </div>

      <RepeatableFieldGroup
        label="Agenda"
        description="A run-of-show schedule for the event."
        count={agenda.fields.length}
        onAdd={() => agenda.append({ time: "", title: "", description: "" })}
        onRemove={agenda.remove}
        emptyLabel="No agenda items yet — click to add one"
        renderRow={(index) => (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr] gap-2">
              <FormField
                control={control}
                name={`agenda.${index}.time`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl><Input placeholder="18:00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`agenda.${index}.title`}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl><Input placeholder="Doors Open" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name={`agenda.${index}.description`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="Description (optional)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      />

      <RepeatableFieldGroup
        label="Lineup"
        description="Performers, speakers, or guests."
        count={lineup.fields.length}
        onAdd={() => lineup.append({ name: "", role: "", imageUrl: "" })}
        onRemove={lineup.remove}
        emptyLabel="No lineup entries yet — click to add one"
        renderRow={(index) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <FormField
              control={control}
              name={`lineup.${index}.name`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="Name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`lineup.${index}.role`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="Role, e.g. Resident DJ" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      />

      <div className="form-grid-2">
        <FormField
          control={control}
          name="dressCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dress Code</FormLabel>
              <FormControl><Input placeholder="e.g. Smart casual" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="ageRestriction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Restriction</FormLabel>
              <FormControl><Input placeholder="e.g. 18+" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="venueNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Notes</FormLabel>
            <FormControl>
              <Textarea rows={2} placeholder="Parking, entrance, what to bring…" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="refundPolicy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refund Policy</FormLabel>
            <FormControl>
              <Textarea rows={2} placeholder="e.g. Tickets are non-refundable but transferable…" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="termsNote"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Terms</FormLabel>
            <FormControl>
              <Textarea rows={2} placeholder="Any other fine print for attendees…" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="form-grid-2">
        <FormField
          control={control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl><Input type="email" placeholder="events@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl><Input type="tel" placeholder="0551234567" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <RepeatableFieldGroup
        label="Social Links"
        description="Shown as links on the public event page."
        count={socialLinks.fields.length}
        onAdd={() => socialLinks.append({ platform: "", url: "" })}
        onRemove={socialLinks.remove}
        emptyLabel="No social links yet — click to add one"
        renderRow={(index) => (
          <div className="grid grid-cols-1 md:grid-cols-[8rem_1fr] gap-2">
            <FormField
              control={control}
              name={`socialLinks.${index}.platform`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="Instagram" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`socialLinks.${index}.url`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="https://instagram.com/yourevent" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      />

      <RepeatableFieldGroup
        label="FAQs"
        count={faqs.fields.length}
        onAdd={() => faqs.append({ question: "", answer: "" })}
        onRemove={faqs.remove}
        emptyLabel="No FAQs yet — click to add one"
        renderRow={(index) => (
          <div className="space-y-2">
            <FormField
              control={control}
              name={`faqs.${index}.question`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="Question" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`faqs.${index}.answer`}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl><Input placeholder="Answer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      />

      <RepeatableFieldGroup
        label="Sponsors"
        count={sponsors.fields.length}
        onAdd={() => sponsors.append({ name: "", logoUrl: "" })}
        onRemove={sponsors.remove}
        emptyLabel="No sponsors yet — click to add one"
        renderRow={(index) => (
          <FormField
            control={control}
            name={`sponsors.${index}.name`}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl><Input placeholder="Sponsor name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      />
    </div>
  )
}
