import RadavilleNav from "@/components/layout/RadavilleNav";

const AboutLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-background overflow-hidden h-screen">
      <RadavilleNav />
      <main className="h-full pb-24">{children}</main>
    </div>
  );
};

export default AboutLayout;