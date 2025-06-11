import React from "react";
import "./Home.css";
import Essentials from "./Essentials";
import Header from "./Header";
import Emergency from "./EssentialsController/Emergency";
import Medical from "./EssentialsController/Medical";
import Utilities from "./EssentialsController/Utilities";
import Vehicles from "./EssentialsController/Vehicles";
import Public from "./EssentialsController/Public";
import Travel from "./EssentialsController/Travel";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate
} from "react-router-dom";
import Police from "./NumberDetails/Emergency/Police";
import Firedepartment from "./NumberDetails/Emergency/Firedepartment";
import DisasterManagent from "./NumberDetails/Emergency/DisasterManagement";
import WomenHelpline from "./NumberDetails/Emergency/WomenHelpline";
import ChildHelpline from "./NumberDetails/Emergency/ChildHelpline";
import Hospitals from "./NumberDetails/Medical/Hospitals";
import Ambulance from "./NumberDetails/Medical/Ambulance";
import Pharmacies from "./NumberDetails/Medical/Pharmacies";
import Practitioners from "./NumberDetails/Medical/Practitioners";
import Electricians from "./NumberDetails/Utilities/Electricians";
import Plumbers from "./NumberDetails/Utilities/Plumbers";
import GasAgencies from "./NumberDetails/Utilities/GasAgencies";
import Wastemanagement from "./NumberDetails/Utilities/Wastemanagement";
import Watertankservices from "./NumberDetails/Utilities/Watertankservices";
import Towservices from "./NumberDetails/Vehicals/Towservices";
import Bikerepairshops from "./NumberDetails/Vehicals/Bikerepairshops";
import Automechanics from "./NumberDetails/Vehicals/Automechanics";
import Localpetrolshops from "./NumberDetails/Vehicals/Localpetrolshops";
import Sosrepairagents from "./NumberDetails/Vehicals/Sosrepairagents";
import Municipalcorp from "./NumberDetails/Public/Municipalcorp";
import Watersupply from "./NumberDetails/Public/Watersupply";
import Electricityboard from "./NumberDetails/Public/Electricityboard";
import Transportinfo from "./NumberDetails/Public/Transportinfo";
import Postalservice from "./NumberDetails/Public/Postalservice";
import Carrentals from "./NumberDetails/Travel/Carrentals";
import Cardrivers from "./NumberDetails/Travel/Cardrivers";
import Travelagencies from "./NumberDetails/Travel/Travelagencies";
import Ticketbookingcenters from "./NumberDetails/Travel/Ticketbookingcenters";
import Tourguides from "./NumberDetails/Travel/Tourguides";
import Adminlogin from "./Admin/Adminlogin";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Doctors from "./NumberDetails/Medical/Doctors";

import { Toaster } from "react-hot-toast";
import Portfolio from "./Admin/Portfolio/Portfolio";

const App = () => {
  const location = useLocation();

  // List of paths where the Header should be hidden
  const noHeaderPaths = [
    "/emergency",
    "/emergency/police",
    "/emergency/fire-department",
    "/emergency/disaster-management",
    "/emergency/women-helpline",
    "/emergency/child-helpline",
    "/medical",
    "/medical/hospitals",
    "/medical/ambulance-services",
    "/medical/pharmacies",
    "/medical/clinics",
    "/medical/doctors",
    "/utilities",
    "/utilities/electricians",
    "/utilities/plumbers",
    "/utilities/gas-agencies",
    "/utilities/house-cleaners",
    "/utilities/pest-controls",
    "/vehicles",
    "/vehicles/tow-services",
    "/vehicles/bike-repair-shops",
    "/vehicles/auto-mechanics",
    "/vehicles/local-petrol-shops",
    "/vehicles/ev-power-hubs",
    "/public",
    "/public/municipal-corporations",
    "/public/water-suppliers",
    "/public/electricity-board",
    "/public/e-gov-centers",
    "/public/postal-service",
    "/travel",
    "/travel/car-rentals",
    "/travel/car-drivers",
    "/travel/travel-agencies",
    "/travel/auto-stands",
    "/travel/residency",
    "/admin/login",
    "/admin/dashboard",
    "/enroll",

    // "/about",
    
    "/"
  ];

  return (
    <div>
      {/* Conditionally render Header based on the current path */}
      {!noHeaderPaths.includes(location.pathname) && <Header />}
      <Routes>
        {/* App Routes */}
        {/* Home Route */}
        <Route path="/beta" element={<Essentials />} />

        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/police" element={<Police />} />
        <Route path="/emergency/fire-department" element={<Firedepartment />} />
        <Route
          path="/emergency/disaster-management"
          element={<DisasterManagent />}
        />
        <Route path="/emergency/women-helpline" element={<WomenHelpline />} />
        <Route path="/emergency/child-helpline" element={<ChildHelpline />} />

        <Route path="/medical" element={<Medical />} />
        <Route path="/medical/hospitals" element={<Hospitals />} />
        <Route path="/medical/ambulance-services" element={<Ambulance />} />
        <Route path="/medical/pharmacies" element={<Pharmacies />} />
        <Route path="/medical/clinics" element={<Practitioners />} />
        <Route path="/medical/doctors" element={<Doctors />} />

        <Route path="/utilities" element={<Utilities />} />
        <Route path="/utilities/electricians" element={<Electricians />} />
        <Route path="/utilities/plumbers" element={<Plumbers />} />
        <Route path="/utilities/gas-agencies" element={<GasAgencies />} />
        <Route
          path="/utilities/house-cleaners"
          element={<Watertankservices />}
        />
        <Route path="/utilities/pest-controls" element={<Wastemanagement />} />

        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/tow-services" element={<Towservices />} />
        <Route
          path="/vehicles/bike-repair-shops"
          element={<Bikerepairshops />}
        />
        <Route path="/vehicles/auto-mechanics" element={<Automechanics />} />
        <Route
          path="/vehicles/local-petrol-shops"
          element={<Localpetrolshops />}
        />
        <Route path="/vehicles/ev-power-hubs" element={<Sosrepairagents />} />
        <Route path="/public" element={<Public />} />
        <Route
          path="/public/municipal-corporations"
          element={<Municipalcorp />}
        />
        <Route path="/public/water-suppliers" element={<Watersupply />} />
        <Route
          path="/public/electricity-board"
          element={<Electricityboard />}
        />
        <Route path="/public/e-gov-centers" element={<Transportinfo />} />
        <Route path="/public/postal-service" element={<Postalservice />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/travel/car-rentals" element={<Carrentals />} />
        <Route path="/travel/car-drivers" element={<Cardrivers />} />
        <Route path="/travel/travel-agencies" element={<Travelagencies />} />
        <Route path="/travel/auto-stands" element={<Ticketbookingcenters />} />
        <Route path="/travel/residency" element={<Tourguides />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Adminlogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/enroll" element={<Portfolio />} />

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/beta" />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
};

const Home = () => <App />;

export default Home;
