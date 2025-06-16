import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true
});


const Profile = ({ adminDetails }) => {
  const [applications, setApplications] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Approved");
  const [filterServiceCategory, setFilterServiceCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const serviceCategories = [
    "Police",
    "Fire Department",
    "Disaster Management",
    "Women Helpline",
    "Child Helpline",
    "Hospitals",
    "Ambulance Services",
    "Pharmacies & clinics",
    "General Practitioners",
    "Specialist Doctors",
    "Electricians",
    "Plumbers",
    "Gas Agencies",
    "Water Can Suppliers",
    "Water Tanks",
    "Car Rentals",
    "Car Drivers",
    "Travel Agencies",
    "Ticket Booking Centers",
    "Tour Guides",
    "Municipal Corporations",
    "Water Supply",
    "Electricity Board",
    "Public Transport Info",
    "Postal Service",
    "Tow Services",
    "Bike Repair Shops",
    "Auto Mechanics",
    "Local Petrol Shops",
    "SOS Repair Agents"
  ];

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    let apiURL = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/services/enroll/allforms`;

    if (filterStatus === "Pending") {
      apiURL = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/services/enroll/pending`;
    } else if (filterStatus === "Rejected") {
      apiURL = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/services/enroll/rejected`;
    } else if (filterStatus === "Approved") {
      apiURL = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/services/enroll/approved`;
    }

    try {
      const response = await axios.get(apiURL);
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to permanently delete this application?"
    );

    if (!isConfirmed) return;

    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      toast.error("Admin token is missing! Please log in.");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` }
        }
      );
      socket.emit("applicationRejected", id);
      toast.success("Application deleted successfully!");
      fetchApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
      } else {
        toast.error("Failed to delete the application.");
      }
    }
  };

  const getCategoryClass = (category) => {
    return typeof category === "string" ? category.toLowerCase() : "unknown";
  };

  const getStatusClass = (status) => {
    return typeof status === "string" ? status.toLowerCase() : "pending";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearchTerm =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm) ||
      app.email?.toLowerCase().includes(searchTerm);

    const matchesCategory =
      filterCategory === "All" || app.category === filterCategory;

    const matchesServiceCategory =
      filterServiceCategory === "All" ||
      app.service_category === filterServiceCategory;

    return matchesSearchTerm && matchesCategory && matchesServiceCategory;
  });

  return (
    <div className="p-5 bg-gray-100">
      <div className="flex justify-between items-start mb-8 gap-5">
        <div className=" p-4 w-94">
          <label className="block text-black-800 font-semibold mb-2">
            Search
          </label>
          <div className="flex">
            <Search className="mt-2 mr-2" />
            <input
              type="text"
              placeholder="Search database"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 w-84"
            />
          </div>
        </div>

        <div className="flex gap-5 p-4 ">
          <div>
            <label className="block text-black-700 font-semibold mb-2">
              Service Category
            </label>
            <select
              value={filterServiceCategory}
              onChange={(e) => setFilterServiceCategory(e.target.value)}
              className="p-2 border border-gray-300"
            >
              <option value="All">All</option>
              {serviceCategories.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-black-700 font-semibold mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 "
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Mail id</th>
                <th className="p-4 text-left font-semibold">Category</th>
                <th className="p-4 text-left font-semibold">Business hours</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">More</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <Fragment key={app.id}>
                  <tr className="hover:bg-white transition ease-out duration-250">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            app.image ||
                            "https://res.cloudinary.com/dhcfcubwa/image/upload/v1740481737/nooho00u6zzhbhqtzbxv.png"
                          }
                          alt={app.name || "User"}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{app.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="p-4">{app.phone || "N/A"}</td>
                    <td className="p-4">{app.email || "N/A"}</td>
                    <td className="p-4">
                      <span
                        className={`p-1 rounded text-xs ${
                          getCategoryClass(app.category) === "emergency"
                            ? "bg-red-100 text-red-700"
                            : getCategoryClass(app.category) === "utilities"
                            ? "bg-blue-100 text-blue-700"
                            : getCategoryClass(app.category) === "vehicle"
                            ? "bg-[#FFC7B3] text-[#9F4729]"
                            : getCategoryClass(app.category) === "travel"
                            ? "bg-[#B3DEFF] text-[#006AFF]"
                            : getCategoryClass(app.category) === "public"
                            ? "bg-[#FFF1A5] text-[#AB9210]"
                            : getCategoryClass(app.category) === "medical"
                            ? "bg-[#CCEDED] text-[#0A8F91]"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {app.category || "Unknown"}
                      </span>
                    </td>
                    <td className="p-4">{app.business_hours || "N/A"}</td>
                    <td className="p-4">
                      <span
                        className={`p-1 rounded text-xs ${
                          getStatusClass(app.status) === "approved"
                            ? "bg-green-100 text-green-700"
                            : getStatusClass(app.status) === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : getStatusClass(app.status) === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedId(expandedId === app.id ? null : app.id)
                        }
                      >
                        {expandedId === app.id ? "▲" : "▼"}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="7"
                      className="transition-all duration-500 overflow-hidden"
                    >
                      <div
                        className={`${
                          expandedId === app.id
                            ? "max-h-[1000px] p-5"
                            : "max-h-0 p-0"
                        } transition-all duration-300 ease-in-out overflow-hidden`}
                      >
                        <div className="border border-gray-300 rounded-lg shadow-lg p-4 space-y-2 max-w-lg mx-auto">
                          <div className="flex justify-between">
                            <strong className="font-semibold">Type:</strong>
                            <span>{app.service_type}</span>
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
                            <strong className="font-semibold">Email:</strong>
                            <span>{app.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Service Category:
                            </strong>
                            <span>{app.service_category}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">Category:</strong>
                            <span>{app.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Aadhar ID:
                            </strong>
                            <span>
                              {app.aadhar_id
                                ? app.aadhar_id.replace(
                                    /(\d{4})(\d{4})(\d{4})/,
                                    "$1 $2 $3"
                                  )
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Medical Speciality:
                            </strong>
                            <span>{app.medical_speciality || ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Business Name:
                            </strong>
                            <span>{app.business_name || ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Business Hours:
                            </strong>
                            <span>{app.business_hours || ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Business Address:
                            </strong>
                            <span>{app.business_address || ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              GMap link:
                            </strong>
                            <span>{app.googleMapLink || ""}</span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Listed on:
                            </strong>
                            <span>
                              {app.created_at
                                ? new Date(app.created_at).toLocaleDateString("en-GB")
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <strong className="font-semibold">
                              Approved by:
                            </strong>
                            <span>
                              {app.approved_by || "N/A"}
                            </span>
                          </div>

                          <button
                            className="mt-4 text-red-900 bg-red-100 rounded-lg p-2 w-full hover:bg-red-200 transition"
                            onClick={() => handleDelete(app.id)}
                          >
                            Delete Entry
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { Fragment } from "react";
export default Profile;
