import Footer from "@/components/layout/Footer";
import RadavilleNav from "../../components/layout/RadavilleNav";


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={"min-h-screen flex flex-col bg-background"}>
      <RadavilleNav />
      <main className={"flex-1"}>
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
