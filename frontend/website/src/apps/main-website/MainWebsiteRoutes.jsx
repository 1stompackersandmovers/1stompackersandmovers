import { Route, Routes } from "react-router";

import MainWebsiteLayout from "./MainWebsiteLayout";
import Home from "./pages/Home/Home";
import ServicesPage from "./pages/Services/ServicesPage";
import ServiceDetail from "./pages/Services/ServiceDetail";
import About from "./pages/About/About";
import Pricing from "./pages/Pricing/Pricing";
import Contact from "./pages/Contact/Contact";
import GetQuote from "./pages/GetQuote/GetQuote";
import WhereWeServe from "./pages/WhereWeServe/WhereWeServe";
import LocationPage from "./pages/Location/LocationPage";
import RoutePage from "./pages/Route/RoutePage";
import Privacy from "./pages/Legal/Privacy";
import Terms from "./pages/Legal/Terms";
import SearchPage from "./pages/Search/SearchPage";
import NotFound from "./shared/components/NotFound";

const MainWebsiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainWebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="about" element={<About />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route path="get-quote" element={<GetQuote />} />
        <Route path="where-we-serve" element={<WhereWeServe />} />
        <Route path="packers-movers-:slug" element={<LocationPage />} />
        <Route path="route/:slug" element={<RoutePage />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default MainWebsiteRoutes;
