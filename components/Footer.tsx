

const Footer = () => {
  return (
    <div className="absolute top-28 right-4 sm:right-6 md:right-8">
      <div className="flex flex-col justify-between gap-6 md:gap-8 text-xs sm:text-sm opacity-60">
        <div className="space-y-1">
          <p className="tracking-widest">01 Services</p>
          <p className="font-light leading-relaxed">
            Seamless Voting · Ticketing · Nominations
          </p>
        </div>
        <div className="space-y-1">
          <p className="tracking-widest">02 Location</p>
          <p className="font-light">Koforidua, Ghana</p>
        </div>
        <div className="space-y-1">
          <p className="tracking-widest">03 Social</p>
          <p className="font-light">Instagram · X · WhatsApp · LinkedIn </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
