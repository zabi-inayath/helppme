import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
function Vehicles() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start invisible
      animate={{ opacity: 1 }} // Fade in smoothly
      transition={{ duration: 0.3 }} // Smooth transition
      className="min-h-screen bg-white"
    >
      {/* Header */}
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
            Vehicle
          </h2>
        </button>
      </div>

      <div>
        <div>
          <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
            {/* Search Bar */}
            <div className="flex absolute top-20 left-1/2 transform -translate-x-1/2 bg-white border border-blue-500 rounded-full shadow-xl px-3 py-2 w-11/12 max-w-md">
              {" "}
              <input
                type="search"
                required
                placeholder="Search for Mechanics"
                className="pl-5 border-none outline-none text-gray-600 placeholder-gray-400 w-full"
              />{" "}
              <div className="search-bg">
                {" "}
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
                  {" "}
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  /> <path d="m21 21-4.3-4.3" />{" "}
                </svg>{" "}
              </div>{" "}
            </div>
            {/* Utilities Session */}
            <div className="border border-gray-300 rounded-lg max-w-80 mt-24 font-san shadow-lg">
              <div className="p-3 rounded-t-lg bg-[#FFC7B3] flex justify-between items-center text-[#9F4729] border-b border-black-300">
                <span className="font-semibold">Vehicles</span>
                <img
                  className="h-8"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740984012/vehiclesTool_ucwbff.svg"
                />
              </div>
              <div className="p-4 rounded-b-lg bg-[#FFE8E8]">
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/vehicles/tow-services`)}
                >
                  <span className="font-medium">Tow Services</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/vehicles/bike-repair-shops`)}
                >
                  <span className="font-medium pr-28">Bike Repair Shops</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/vehicles/auto-mechanics`)}
                >
                  <span className="font-medium">Auto Mechanics</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/vehicles/local-petrol-shops`)}
                >
                  <span className="font-medium">Local Petrol Shops</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/vehicles/ev-power-hubs`)}
                >
                  <span className="font-medium">EV Power Hubs</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Vehicles;
