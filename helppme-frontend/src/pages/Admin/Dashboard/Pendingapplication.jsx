import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true
});

function PendingApplications() {
  const [applications, setApplications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch pending applications
  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/enroll/pending`
        );

        if (response.data.success) {
          setApplications(response.data.data);
        } else {
          console.error("API did not return success:", response.data);
        }
      } catch (error) {
        console.error("Error fetching pending applications:", error);
      }
    };

    // Initial fetch
    fetchPendingApplications();

    // Periodic fetch every 10 seconds
    const interval = setInterval(fetchPendingApplications, 10000);

    // Clear interval on cleanup
    return () => clearInterval(interval);
  }, []);

  // Approve application
  const handleApprove = async (id) => {
    const adminToken = localStorage.getItem("adminToken");
    const adminName = localStorage.getItem("adminName"); // get admin name

    if (!adminToken) {
      toast.error("Admin token is missing! Please log in.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/approve/${id}`,
        { approved_by: adminName }, // send admin name in body
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      socket.emit("applicationApproved", id);
      toast.success("Application approved successfully!");
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Cookie Expired. Please login again.");
    }
  };

  // Reject application
  const handleReject = async (id) => {
    const adminToken = localStorage.getItem("adminToken");
    const adminName = localStorage.getItem("adminName"); // get admin name

    if (!adminToken) {
      toast.error("Admin token is missing! Please log in.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reject/${id}`,
        { rejected_by: adminName }, // send admin name in body
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      socket.emit("applicationRejected", id);
      toast.success("Application rejected successfully!");
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Cookie Expired. Please login again.");
    }
  };

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mt-4 space-y-4">
      {applications.length === 0 ? (
        <p className="text-center text-gray-500">No pending applications</p>
      ) : (
        applications.map((app) => (
          <React.Fragment key={app.id}>
            {/* Main User Div */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-white rounded-lg transition ease-out duration-200 space-y-4 md:space-y-0">
              <div
                className="flex items-center space-x-3 w-full md:w-auto cursor-pointer"
                onClick={() => toggleExpand(app.id)}
              >
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <div className="flex-1">
                  <p className="font-semibold text-base md:text-lg">
                    {app.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {app.service_category}
                  </p>
                </div>
              </div>

              <div
                onClick={() => toggleExpand(app.id)}
                className="w-full cursor-pointer md:w-auto flex flex-col md:flex-row justify-between md:space-x-6 text-sm text-gray-600"
              >
                <p>{app.phone}</p>
                <p className="mt-2 md:mt-0">{app.email}</p>
              </div>

              <div className="flex space-x-2 w-full md:w-auto justify-center">
                <img
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741669062/reject_pekjei.svg"
                  alt="Reject"
                  className="cursor-pointer w-16 h-16 mr-5"
                  onClick={() => handleReject(app.id)}
                />
                <img
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1741669148/approve_p8wbha.svg"
                  alt="Approve"
                  className="cursor-pointer w-16 h-16"
                  onClick={() => handleApprove(app.id)}
                />
              </div>
            </div>

            {/* Expanded Card (Separate Below with Animation for Open/Close) */}
            <AnimatePresence>
              {expandedId === app.id && (
                <motion.div
                  className="border border-gray-300 rounded-lg shadow-lg p-4 space-y-2 max-w-2xl mx-auto mt-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex justify-between">
                    <strong className="font-semibold">Type:</strong>
                    <span>{app.service_type}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <strong className="font-semibold whitespace-nowrap mr-4">
                      Message:
                    </strong>
                    <span className="break-words overflow-hidden max-w-full">
                      {app.message}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Name:</strong>
                    <span>{app.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Phone:</strong>
                    <span>{app.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Location:</strong>
                    <span>{app.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Category:</strong>
                    <span>{app.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Service Category:</strong>
                    <span>{app.service_category}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Business Hours:</strong>
                    <span>{app.business_hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Aadhar ID:</strong>
                    <span>{app.aadhar_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">
                      Medical Speciality:
                    </strong>
                    <span>{app.medical_speciality}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Hospital Name:</strong>
                    <span>{app.hospitalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Google Map Link:</strong>
                    <span>{app.googleMapLink}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong className="font-semibold">Received on:</strong>
                    <span>
                      {app.created_at
                        ? new Date(app.created_at)
                            .toLocaleString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })
                            .replace(", ", " -- ")
                        : "N/A"}
                    </span>
                  </div>

                  <button
                    className="mt-4 text-emerald-900 bg-emerald-300 rounded-lg p-2 w-full hover:bg-emerald-200 transition"
                    onClick={() => handleApprove(app.id)}
                  >
                    Accept
                  </button>
                  <button
                    className=" text-red-900 bg-red-100 rounded-lg p-2 w-full hover:bg-red-200 transition"
                    onClick={() => handleReject(app.id)}
                  >
                    Reject
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        ))
      )}
    </div>
  );
}

export default PendingApplications;
