import { Outlet } from "react-router";
import Footer from "./shared/components/Footer";
import Header from "./shared/components/Header";

const MainWebsiteLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainWebsiteLayout;
