import { Routes, Route, useLocation } from "react-router-dom";
import MappingDashboard from "./pages/MappingDashboard";
import TrainingPage from "./pages/TrainingPage";
import AutoValidation from "./pages/AutoValidation";
import Allmappingdata from "./pages/Allmappingdata";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import AyurvedaTerms from "./pages/AyurvedaTerms";
import FinalMap from "./pages/FinalMap";
import ApiDocs from "./pages/ApiDocs";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();

  const pageTitles = {
    "/": "Mapping Dashboard",
    "/training": "Training Dashboard",
    "/autovalidation": "Auto Validation Dashboard",
    "/allmappingdata": "All Mapping Data",
    "/about": "About Namaste ICD",
    "/ayurvedaterms": "Who Ayurveda Terminologies",
    "/finalmap": "Final Mapping Dataset",
  };

  const currentTitle = pageTitles[location.pathname] || "Namaste ICD Dashboard";

  return (
    <>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="lg:ml-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          title={currentTitle}
        />

        <Routes>
          <Route path="/" element={<MappingDashboard />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/autovalidation" element={<AutoValidation />} />
          <Route path="/allmappingdata" element={<Allmappingdata />} />
          <Route path="/about" element={<About/>} />
          <Route path="/ayurvedaterms" element={<AyurvedaTerms/>} />
          <Route path="/finalmap" element={<FinalMap/>} />
          <Route path="/apidocs" element={<ApiDocs/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
