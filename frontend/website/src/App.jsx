import { BrowserRouter, Route, Routes } from "react-router";
import MainWebsiteRoutes from "./apps/main-website/MainWebsiteRoutes";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<MainWebsiteRoutes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
