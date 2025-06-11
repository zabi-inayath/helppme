import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MutatingDots } from "react-loader-spinner";
import NetworkStatus from "../store/NetworkStatus";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const serviceCategories = {
    Emergency: [
      "Police",
      "Fire Department",
      "Disaster Management",
      "Women Helpline",
      "Child Helpline"
    ],
    Medical: [
      "Hospitals",
      "Ambulance Services",
      "Pharmacies",
      "Clinics",
      "Doctors"
    ],
    Utilities: [
      "Electricians",
      "Plumbers",
      "Gas Agencies",
      "House Cleaners",
      "Pest Controls"
    ],
    Travel: [
      "Car Rentals",
      "Car Drivers",
      "Travel Agencies",
      "Auto Stands",
      "Residency"
    ],
    Public: [
      "Municipal Corporations",
      "Water Suppliers",
      "Electricity Board",
      "E-Gov Centers",
      "Postal Service"
    ],
    Vehicles: [
      "Tow Services",
      "Bike Repair Shops",
      "Auto Mechanics",
      "Local Petrol Shops",
      "EV Power Hubs"
    ]
  };

  // Combine all services with their categories
  const suggestions = Object.entries(serviceCategories).flatMap(
    ([category, services]) =>
      services.map((service) => ({
        name: service,
        category
      }))
  );

  // Filter and prioritize suggestions
  const filteredSuggestions = searchTerm
    ? suggestions
        .filter(({ name }) =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          if (aName === "doctor") return -1;
          if (bName === "doctor") return 1;

          return aName.localeCompare(bName);
        })
    : [];

  // Find the category of the selected service
  const getCategory = (service) => {
    for (let category in serviceCategories) {
      if (serviceCategories[category].includes(service)) {
        return category.toLowerCase();
      }
    }
    return "others";
  };

  // Handle search selection
  const handleSearchSelect = (selectedItem) => {
    setSearchTerm(selectedItem);
    setShowDropdown(false);
    const category = getCategory(selectedItem);
    navigate(`/${category}/${selectedItem.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <>
      <NetworkStatus/>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#0175F3"
            secondaryColor="#0175F3"
          />
        </div>
      ) : (
        <div className="header">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              className="w-full h-88 object-cover"
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983237/background_card_wdba94.svg"
              alt="Background"
            />
            <img
              className="logo absolute top-4 left-4 w-40 h-20 md:w-50 md:h-24"
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983237/logo_rnvf0o.svg"
              alt="Logo"
            />
            <h1 className="text-4xl font-medium text-white absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
              Get Help Quickly
            </h1>

            {/* Search Bar */}
            <div
              className="flex search-bar absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white border border-blue-500 rounded-full shadow-xl px-3 py-2 w-11/12 max-w-md"
              ref={searchRef}
            >
              <input
                type="search"
                required
                placeholder="Search for services"
                className="pl-5 border-none outline-none text-gray-600 placeholder-gray-400 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              <div className="search-bg">
                <svg
                  className="ml-[10px] mt-2 h-6 w-6 text-blue-500 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && filteredSuggestions.length > 0 && (
              <div className="absolute bottom-0.4 left-1/2 transform -translate-x-1/2 w-94 h-40 bg-white border border-gray-300 shadow-lg rounded-3xl mt-2 z-10 overflow-y-auto scrollbar-hide">
                {filteredSuggestions.map(({ name, category }, index) => (
                  <div
                    key={index}
                    className="p-3 cursor-pointer hover:bg-gray-100 text-gray-700 font-medium flex justify-between"
                    onClick={() => handleSearchSelect(name)}
                  >
                    <span>{name}</span>
                    <span className="text-sm text-blue-500">{category}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Header;
