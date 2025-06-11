import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
function Travel() {
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
            Travel
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
                placeholder="Search for Drivers"
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
              <div className="p-3 rounded-t-lg bg-[#9bd4ff] flex justify-between items-center text-[#006AFF] border-b border-black-300">
                <span className="font-semibold">Travels</span>
                <img
                  className="h-8"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983910/TravelTool_acbfnp.svg"
                />
              </div>
              <div className="p-4 rounded-b-lg bg-[#B3DEFF]">
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/travel/car-rentals`)}
                >
                  <span className="font-medium">Car Rentals</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/travel/car-drivers`)}
                >
                  <span className="font-medium">Car Drivers</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/travel/travel-agencies`)}
                >
                  <span className="font-medium">Travel Agencies</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 border-b border-gray-400 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/travel/auto-stands`)}
                >
                  <span className="font-medium pr-36">Auto Stands</span>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg" />
                </div>
                <div
                  className="py-3 flex justify-between items-center text-gray-700 cursor-pointer"
                  onClick={() => navigate(`/travel/residency`)}
                >
                  <span className="font-medium">Residency</span>
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

export default Travel;
