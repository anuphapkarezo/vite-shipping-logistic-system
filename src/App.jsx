import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import SmartShip_Flight_Condition_Details from "./pages/SmartShip_Flight_Condition_Details";

export default function App() {
  
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Navbar />}/>
              <Route path="/smartship_flight_condition_details" element={<SmartShip_Flight_Condition_Details/>} />
            </Route>
        </Routes>
  );
}
