import { Route, Routes } from "react-router";

import MainWebsiteLayout from "./MainWebsiteLayout";
import Home from "./pages/Home/Home";
import NotFound from "./shared/components/NotFound";

const MainWebsiteRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainWebsiteLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Routes>
    </div>
  );
};

export default MainWebsiteRoutes;
