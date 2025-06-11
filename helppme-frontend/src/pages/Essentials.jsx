import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Essentials() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Reference for the SOS menu

  // Function to close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="px-4 md:px-8 pt-26 pb-24">
        {/* Essentials Section */}
        <motion.div
          initial={{ opacity: 0 }} // Start invisible
          animate={{ opacity: 1 }} // Fade in smoothly
          transition={{ duration: 0.5 }}
        >
          <section className="text-black">
            <h3 className="text-xl font-semibold mb-4">Essentials</h3>
            <div className="grid grid-cols-2 gap-4 pb-5">
              {/* Essentials Buttons */}
              <div onClick={() => navigate("/emergency")}>
                <img
                  className="essential-svg"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983019/emergency_kvo9zb.svg"
                  alt="Emergency"
                />
              </div>
              <div onClick={() => navigate("/medical")}>
                <img
                  className="essential-svg"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983130/medical_kd13ff.svg"
                  alt="Medical"
                />
              </div>
              <div onClick={() => navigate("/utilities")}>
                <img
                  className="essential-svg"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983131/utilities_tblvx8.svg"
                  alt="Utilities"
                />
              </div>
              <div onClick={() => navigate("/vehicles")}>
                <img
                  className="essential-svg"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983132/vehicles_wqf6fl.svg"
                  alt="Vehicles"
                />
              </div>
              <div onClick={() => navigate("/public")}>
                <img
                  className="essential-svg"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983130/public_y86wea.svg"
                  alt="Public"
                />
              </div>
              <div onClick={() => navigate("/travel")}>
                <img
                  className="essential-svg"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983130/travel_l5evpb.svg"
                  alt="Travel"
                />
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      {/* SOS Button and Menu */}
      <div className="fixed bottom-6 right-6" ref={menuRef}>
        {/* SOS Button */}
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="fixed bottom-6 right-6 bg-orange-500 text-white font-semibold text-xl rounded-full w-20 h-20 shadow-lg border-4 border-orange-200 flex items-center justify-center"
        >
          SOS
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute bottom-20 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200">
            <ul className="text-black text-md font-medium p-3 space-y-2">
              <li
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => (window.location.href = "tel:108")}
              >
                Ambulance
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => (window.location.href = "tel:100")}
              >
                Police
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => (window.location.href = "tel:101")}
              >
                Fire
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => (window.location.href = "tel:181")}
              >
                Women’s helpline
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => (window.location.href = "tel:1098")}
              >
                Children’s helpline
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Essentials;
