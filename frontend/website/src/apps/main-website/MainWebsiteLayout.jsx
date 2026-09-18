import { Outlet } from "react-router";
import Footer from "./shared/components/Footer";
import Header from "./shared/components/Header";
import MobileActionBar from "./shared/components/MobileActionBar";

const MainWebsiteLayout = () => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      {/* pt-16 on mobile, pt-20 on lg - matches header height */}
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
};

export default MainWebsiteLayout;
