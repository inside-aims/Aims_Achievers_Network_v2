import RadavilleNav from "../../components/shared/RadavilleNav";


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={"min-h-screen bg-background"}>
      <RadavilleNav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
