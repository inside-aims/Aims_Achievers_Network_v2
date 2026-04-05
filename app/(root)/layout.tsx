"use client";
import Footer from "@/components/layout/Footer";
import RadavilleNav from "../../components/layout/RadavilleNav";
import { ReactLenis } from "lenis/react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ReactLenis root>
      <div className={"bg-background"}>
        <RadavilleNav />
        <main>{children}</main>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Layout;
