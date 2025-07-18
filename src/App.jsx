import * as React from "react"; // นำเข้าโมดูลทั้งหมดที่ต้องการจาก React, ให้เราสามารถใช้งานฟีเจอร์ต่างๆ ของ React
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import ProtectedRoutesSupper from "./components/auth/ProtectedRoutesSupper";
import Login from "./pages/Login";
import Navbar from "./components/navbar/Navbar";
import SmartShip_Flight_Condition_Details from "./pages/SmartShip_Flight_Condition_Details";
import SmartShip_Check_Charge_Weight from "./pages/SmartShip_Check_Charge_Weight";
import SmartShip_Monthly_Report from "./pages/SmartShip_Monthly_Report";
import SmartShip_Export_Entry_Report from "./pages/SmartShip_Export_Entry_Report";

export default function App() {
  
  return (
    
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/home" element={<Navbar />}/>
              <Route path="/smartship_flight_condition_details" element={<SmartShip_Flight_Condition_Details/>} />
              <Route path="/smartship_check_charge_weight" element={<SmartShip_Check_Charge_Weight/>} />
              <Route path="/smartship_monthly_report" element={<SmartShip_Monthly_Report/>} />
              <Route path="/SmartShip_export_entry_report" element={<SmartShip_Export_Entry_Report/>} />
            </Route>
        </Routes>
  );
}
