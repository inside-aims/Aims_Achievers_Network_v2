import React from "react";
import TicketLookupForm from "@/components/features/tickets/ticket-lookup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets",
  description:
    "Find and view your event tickets. Look up by email, phone number, or ticket code to access your QR code for entry.",
};

const TicketsPage = () => {
  return (
    <div id="tickets" className="feature">
      <section className="flex flex-col gap-6 md:gap-8 min-h-screen max-w-2xl mx-auto">
        {/* Page header */}
        <div className="parent-header text-center">
          <h1 className="feature-header">Find My Tickets</h1>
          <p className="feature-subheader">
            Look up your tickets using your email address, phone number, or ticket code.
            Your QR code ticket will be displayed for event entry.
          </p>
        </div>

        {/* Lookup form with results */}
        <TicketLookupForm />

        {/* Help text */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-muted-foreground">
            Tickets are sent to your email after purchase.
            If you can&apos;t find your ticket, check your spam folder or contact the event organizer.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TicketsPage;
