import TicketLookupForm from "./ticket-lookup-form";

const TicketsView = () => {
  return (
    <div id="tickets" className="feature">
      <section className="flex flex-col gap-6 md:gap-8 min-h-screen max-w-2xl mx-auto">
        <div className="parent-header text-center">
          <h1 className="feature-header">Find My Tickets</h1>
          <p className="feature-subheader">
            Look up your tickets using your email address, phone number, or ticket code.
            Your QR code ticket will be displayed for event entry.
          </p>
        </div>

        <TicketLookupForm />

        <p className="text-xs text-muted-foreground text-center pt-4">
          Tickets are sent to your email after purchase. If you can&apos;t find your ticket,
          check your spam folder or contact the event organizer.
        </p>
      </section>
    </div>
  );
};

export default TicketsView;
