import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import { MutatingDots } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock3, LayoutGrid, Settings, Phone } from "lucide-react";

function Firedepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New state for default loading

  const { data, loading, error } = useUserStore();

  // Simulate loading for 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <MutatingDots
          visible={true}
          height="100"
          width="100"
          color="#0175F3"
          secondaryColor="#0175F3"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex justify-center items-center h-screen overflow-hidden">
        {/* Blurred Background */}
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-md"></div>

        {/* Error Message */}
        <div className="z-10 text-lg text-red-800 font-medium">Something went wrong!</div>
        {console.log(error)}
      </div>
    );
  }

  const contacts = data
    .filter((item) => item.service_category === "Fire Department") // Filter only Fire Department
    .map((item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      phone: item.phone,
      image: item.image,
      service_category: item.service_category,
      category: item.category,
      business_hours: item.business_hours
    }));

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start invisible
      animate={{ opacity: 1 }} // Fade in smoothly
      transition={{ duration: 0.5 }} // Smooth transition
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
            Fire Department
          </h2>
        </button>
      </div>
      {/* Contact List */}
      <div className="p-4">
        {contacts.length === 0 ? (
          <h1 className="text-center text-gray-600 font-semibold mt-10">
            No contacts found
          </h1>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex border-b-1 border-gray-400 items-center justify-between px-4 py-3"
            >
              {/* Left - Profile & Name */}
              <div className="flex items-center space-x-3">
                <img
                  src={contact.image}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-gray-900 font-medium">
                    {contact.name.length > 15 ? contact.name.substring(0, 15) + "..." : contact.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{contact.location.length > 15 ? contact.location.substring(0, 18) + "..." : contact.location}</p>
                </div>
              </div>

              {/* Right - Call Button */}
              <div className="flex">
                <img
                  className="pr-6 cursor-pointer"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg"
                  alt="View Contact"
                  onClick={() => setSelectedContact(contact)}
                />
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg"
                >
                  <img
                    src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740984201/Phone_cak2rz.svg"
                    alt="Call"
                  />
                  <span className="font-semibold">Call</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Contact Modal (Without Separate Component) */}.
      <AnimatePresence>
        {selectedContact && (
          <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
            onClick={(e) => {
              // Close modal if clicked outside the modal content
              if (e.target === e.currentTarget) {
                setSelectedContact(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-80 p-6"
            >
              {/* Profile and Name */}
              <div className="flex items-center space-x-4 mb-6 object-cover">
                <img
                  src={selectedContact.image}
                  alt={selectedContact.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedContact.name}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    {selectedContact.location ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="12"
                          viewBox="0 0 11 12"
                          fill="none"
                        >
                          <path
                            d="M9.59687 1.79435L6.93253 0.980928C6.50969 0.851834 6.06887 0.786133 5.62542 0.786133C5.18196 0.786133 4.74115 0.851834 4.3183 0.980928L1.65396 1.79435C1.09723 1.96433 0.71875 2.46361 0.71875 3.02805V7.4999C0.71875 8.32205 1.12288 9.09529 1.80749 9.58299L4.41766 11.4424C4.76757 11.6917 5.1908 11.8261 5.62542 11.8261C6.06004 11.8261 6.48326 11.6917 6.83317 11.4424L9.44334 9.58299C10.128 9.09529 10.5321 8.32205 10.5321 7.4999V3.02805C10.5321 2.46361 10.1536 1.96433 9.59687 1.79435ZM7.6756 5.69626L5.46771 7.83084C5.20641 8.08347 4.78276 8.08347 4.52148 7.83084L3.57523 6.91603C3.31393 6.6634 3.31393 6.25382 3.57523 6.00122C3.83653 5.74859 4.26018 5.74859 4.52146 6.00122L4.99458 6.45862L6.72935 4.78145C6.99065 4.52882 7.4143 4.52882 7.67558 4.78145C7.9369 5.03405 7.9369 5.44363 7.6756 5.69626Z"
                            fill="#299320"
                          />
                        </svg>
                        Verified
                      </>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Not verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Sections */}
              <div className="space-y-4 text-sm text-gray-800">
                <div>
                  <p className="font-semibold text-gray-900">Service Area</p>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    {selectedContact.location}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Category</p>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <LayoutGrid className="w-4 h-4" />
                    {selectedContact.category.charAt(0).toUpperCase() +
                      selectedContact.category.slice(1).toLowerCase()}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-900">Service</p>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <Settings className="w-4 h-4" />
                    {selectedContact.service_category}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="font-semibold text-gray-900">
                    Business Hours
                  </p>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <Clock3 className="w-4 h-4" />
                    {selectedContact.business_hours}
                  </div>
                </div>
              </div>

              {/* Call Button */}
              <a
                href={`tel:${selectedContact.phone}`}
                className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call
              </a>

              {/* Optional Close Button (if needed) */}
              {/* <button
                           className="mt-4 text-center text-sm text-gray-500 hover:text-gray-700 w-full"
                           onClick={() => setSelectedContact(null)}
                         >
                           Close
                         </button> */}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Firedepartment;
