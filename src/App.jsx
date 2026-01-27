import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import FleetListPage from "./pages/FleetlistPage";
import AeGLTablePage from "./pages/AeGLTablePage";
import VshipsGLTablePage from "./pages/VshipsGLTablePage";
import { HeaderSection } from "./components/HeaderSection/HeaderSection";

function App() {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  // Called when a card is clicked
  const handleCardClick = (path) => {
    setActiveMenu(path); // header shows active menu only after clicking
    navigate(path);
  };

  return (
    <>
      <HeaderSection 
        activeMenu={activeMenu} 
        onNavigate={(path) => {
          setActiveMenu(path);
          navigate(path);
        }}
      />

      <Routes>
        <Route
          path="/"
          element={<Dashboard onCardClick={handleCardClick} />}
        />
        <Route path="/insw-vessels" element={<FleetListPage />} />

        <Route path="/AETMS/general-ledger" element={<AeGLTablePage/>} />
        <Route path="/V.Ships/general-ledger" element={<VshipsGLTablePage/>} />
      </Routes>
    </>
  );
}

export default App;
