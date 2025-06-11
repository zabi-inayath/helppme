import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

function Emergency() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  const emergencyServices = [
    { id: "police", name: "Police" },
    { id: "fire-department", name: "Fire department" },
    { id: "disaster-management", name: "Disaster Management" },
    { id: "women-helpline", name: "Women Helpline" },
    { id: "child-helpline", name: "Child Helpline" }
  ];

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
      "Pharmacies & clinics",
      "General Practitioners",
      "Specialist Doctors"
    ],
    Utilities: [
      "Electricians",
      "Plumbers",
      "Gas Agencies",
      "Water Can Suppliers",
      "Water Tanks"
    ],
    Travel: [
      "Car Rentals",
      "Car Drivers",
      "Travel Agencies",
      "Ticket Booking Centers",
      "Tour Guides"
    ],
    Public: [
      "Municipal Corporations",
      "Water Supply",
      "Electricity Board",
      "Public Transport Info",
      "Postal Service"
    ],
    Vehicle: [
      "Tow Services",
      "Bike Repair Shops",
      "Auto Mechanics",
      "Local Petrol Shops",
      "SOS Repair Agents"
    ]
  };

  // Convert all service names into a single list for search
  const suggestions = Object.values(serviceCategories).flat();

  // Filter suggestions based on search input
  const filteredSuggestions = searchTerm
    ? suggestions.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Find the category of the selected service
  const getCategory = (service) => {
    for (let category in serviceCategories) {
      if (serviceCategories[category].includes(service)) {
        return category.toLowerCase();
      }
    }
    return "others"; // Default category if not found
  };

  // Handle search selection
  const handleSearchSelect = (selectedItem) => {
    setSearchTerm(selectedItem);
    setShowDropdown(false);
    const category = getCategory(selectedItem);
    navigate(`/${category}/${selectedItem.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start invisible
      animate={{ opacity: 1 }} // Fade in smoothly
      transition={{ duration: 0.3 }} // Smooth transition
      className="min-h-screen bg-white"
    >
      <div className="flex items-center p-4 shadow-lg bg-white">
        <button
          onClick={() => navigate(-1)}
          className="pl-2 flex text-gray-600"
        >
          <img
            src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740984155/leftArrow_o8zaz3.svg"
            alt="Back"
          />
          <h2 className="text-l font-semibold cursor-pointer text-[#0175F3] ml-3">
            Emergency
          </h2>
        </button>
      </div>

      <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
        {/* Search Bar */}
        <div className="flex absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border border-blue-500 rounded-full shadow-xl px-3 py-2 w-11/12 max-w-md">
          <input
            type="search"
            required
            placeholder="Search for Ambulance"
            className="pl-5 border-none outline-none text-gray-600 placeholder-gray-400 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          <div className="search-bg">
            <svg
              className="ml-[10px] mt-2 h-6 w-6 text-blue-500"
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
          <div className="absolute left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white border border-gray-300 shadow-lg rounded-xl mt-9 z-10">
            {filteredSuggestions.map((item, index) => (
              <div
                key={index}
                className="p-3 cursor-pointer hover:bg-gray-100 text-gray-700 font-medium"
                onClick={() => handleSearchSelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Utilities Section */}
        <div className="border border-gray-300 rounded-lg max-w-100 mt-24 font-san shadow-lg">
          <div className="p-3 rounded-t-lg bg-[#FFE8E8] flex justify-between items-center text-[#bc5757] border-b border-black-300">
            <span className="font-semibold">Emergency</span>
            <img
              className="h-8"
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/Group_ea4ipc.svg"
            />
          </div>
          <div className="p-4 rounded-b-lg bg-[#FFE8E8]">
            <div
              className="py-3 border-b border-gray-300 flex justify-between items-center text-gray-700 cursor-pointer"
              onClick={() => navigate(`/emergency/${emergencyServices[0].id}`)}
            >
              <span className="font-medium text-[#bc5757]">Police</span>
              <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
            </div>
            <div
              className="py-3 border-b border-gray-300 flex justify-between items-center text-gray-700 cursor-pointer"
              onClick={() => navigate(`/emergency/${emergencyServices[1].id}`)}
            >
              <span className="font-medium text-[#bc5757]">
                Fire department
              </span>
              <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
            </div>
            <div
              className="py-3 border-b border-gray-300 flex justify-between items-center text-gray-700 cursor-pointer"
              onClick={() => navigate(`/emergency/${emergencyServices[2].id}`)}
            >
              <span className="font-medium pr-18 text-[#bc5757]">
                Disaster Management
              </span>
              <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
            </div>
            <div
              className="py-3 border-b border-gray-300 flex justify-between items-center text-gray-700 cursor-pointer"
              onClick={() => navigate(`/emergency/${emergencyServices[3].id}`)}
            >
              <span className="font-medium text-[#bc5757]">Women Helpline</span>
              <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
            </div>
            <div
              className="py-3 flex justify-between items-center text-gray-700 cursor-pointer"
              onClick={() => navigate(`/emergency/${emergencyServices[4].id}`)}
            >
              <span className="font-medium text-[#bc5757]">Child Helpline</span>
              <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Emergency;
