import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import { MutatingDots } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope,
  MapPin,
  Clock3,
  Building2,
  Phone,
  CornerUpRight,
  CalendarDays
} from "lucide-react";

function Doctors() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

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

  const medicalSpecialties = [
    "All",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic",
    "Gynecologist",
    "Ophthalmologist",
    "Dentist",
    "General Physician",
    "ENT Specialist",
    ...new Set(
      data
        .filter((item) => item.service_category === "Doctor")
        .map((item) => item.medical_speciality)
        .filter((spec) => spec)
    )
  ];

  const contacts = data
    .filter((item) => item.service_category === "Doctor")
    .filter(
      (item) =>
        (selectedSpeciality === "All" ||
          item.medical_speciality === selectedSpeciality) &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      phone: item.phone,
      image: item.image,
      service_category: item.service_category,
      business_hours: item.business_hours,
      medical_speciality: item.medical_speciality,
      hospitalName: item.hospitalName,
      working_day: item.working_day,
    }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
            Doctors
          </h2>
        </button>
      </div>

      <div className="px-26 pt-4 space-y-4">
        {/* Filter Dropdown */}
        <div className="relative w-full max-w-md mx-auto">
          <label className="block text-[#0175F3] text-center font-medium mb-2">
            Medical Speciality
          </label>
          <select
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none"
          >
            {medicalSpecialties.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          {/* Custom arrow icon */}
          <span className="text-[#0075f2] pointer-events-none absolute right-4 top-13.5 transform -translate-y-1/2">
            ▼
          </span>
        </div>
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

              <div className="flex">
                <img
                  className="pr-6 cursor-pointer"
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740983401/chevron-left_yxwgrs.svg"
                  alt="View Contact"
                  onClick={() => setSelectedContact(contact)}
                />
                <a
                  href={`tel:${contact.phone}`}
                  onClick={async (e) => {
                    // Handle call count update
                    console.log("Call button clicked for contact:", contact.name);
                    try {
                      await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/services/call/${contact.id}`
                      );
                      // Optionally: toast.success("Call count updated!");
                    } catch (err) {
                      // Optionally: toast.error("Failed to update call count");
                    }
                  }}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg"
                >
                  <img
                    src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740984201/Phone_cak2rz.svg"
                    alt="Call"
                  />
                  <span className="font-semibold mr-2">Call</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {selectedContact && (
          <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50"
            onClick={(e) => {
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
              className="bg-white rounded-2xl overflow-hidden shadow-lg w-80"
            >
              <div className="h-28 bg-gradient-to-r from-gray-200 to-gray-300">
                <img
                  src={selectedContact.image}
                  alt={selectedContact.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 text-left space-y-4">
                <h2 className="text-2xl font-semibold text-black">
                  {selectedContact.name}
                </h2>

                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-green-600" />
                  {selectedContact.medical_speciality}
                </p>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Address
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedContact.location}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Timing
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    {selectedContact.business_hours}
                  </p>
                </div>

                {/* Working Day */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Working Day
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {selectedContact.working_day || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Hospital / Clinic
                  </h4>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {selectedContact.hospitalName}
                  </p>
                </div>

                
              </div>

              <div className="px-4 pb-5 space-y-3">
                <a
                  href={`https://maps.app.goo.gl/VEHsLjwgAm536Eg9A`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-100 text-red-500 text-lg py-2 rounded-lg hover:bg-red-200 transition flex justify-center items-center gap-2"
                >
                  <CornerUpRight className="w-5 h-5" />
                  Directions
                </a>
                <a
                  href={`tel:${selectedContact.phone}`}
                  onClick={async (e) => {
                    // Handle call count update
                    console.log("Call button clicked for contact:", selectedContact.name);
                    try {
                      await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/services/call/${selectedContact.id}`
                      );
                      // Optionally: toast.success("Call count updated!");
                    } catch (err) {
                      // Optionally: toast.error("Failed to update call count");
                    }
                  }}
                  className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Doctors;
