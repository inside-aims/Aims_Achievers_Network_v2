import Footer from "@/components/layout/Footer";
import RadavilleNav from "../../components/layout/RadavilleNav";


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={"bg-background overflow:hidden"}>
      <RadavilleNav />
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default Layout;
