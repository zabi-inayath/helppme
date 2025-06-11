import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsCheckCircle } from "react-icons/bs";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true
});


function ApprovedApplications() {
  const [applications, setApplications] = useState([]);

  // Fetch pending applications initially
  useEffect(() => {
    const fetchApprovedApplications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/enroll/approved`
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching Approved applications:", error);
      }
    };

    fetchApprovedApplications();

    const interval = setInterval(() => {
      fetchApprovedApplications();
    }, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      alert("Admin token is missing! Please log in.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/reject/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );

      socket.emit("applicationRejected", id);
      alert("Application Deleted successfully!");
    } catch (error) {
      console.error("Error Deleting application:", error);
      alert("Cookie Expired. Please login again.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mt-4">
      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-gray-500">No pending applications</p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={app.image}
                  alt={app.name}
                  className="w-10 h-10 rounded-full object-cover bg-gray-200"
                />
                <div>
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-gray-500">
                    {app.service_category}
                  </p>
                </div>
              </div>

              <p className="text-gray-600">{app.phone}</p>
              <p className="text-gray-600">{app.email}</p>

              <div className="flex space-x-1">
                <BsCheckCircle className="mt-1" size={20} />{" "}
                <p className="mt-1">Verified</p>
                <button
                  className="text-red-900 cursor-pointer mx-2 bg-red-100 rounded-lg p-2"
                  onClick={() => handleDelete(app.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApprovedApplications;
