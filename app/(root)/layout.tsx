import Footer from "@/components/layout/Footer";
import RadavilleNav from "@/components/layout/RadavilleNav";
import LenisProvider from "@/components/layout/lenis-provider";
import XolacePromoRibbon from "@/components/features/xolace/xolace-promo-ribbon";
import { MobileDownloadBar } from "@/components/features/xolace/mobile-download-bar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <LenisProvider>
      <div className={"bg-background"}>
        <XolacePromoRibbon />
        <RadavilleNav />
        <main>{children}</main>
        <Footer />
        <MobileDownloadBar />
      </div>
    </LenisProvider>
  );
};

export default Layout;
