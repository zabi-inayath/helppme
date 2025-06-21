import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { Search } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true
});


const Profile = () => {
  const [applications, setApplications] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Approved");
  const [filterServiceCategory, setFilterServiceCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

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
      "Are you sure you want to permanently delete this service?"
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
    <div className="p-2 sm:p-5 bg-gray-100 min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-5">
        <div className="p-4 w-full md:w-96">
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
              className="p-2 border border-gray-300 w-full"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 p-4 w-full md:w-auto">
          <div>
            <label className="block text-black-700 font-semibold mb-2">
              Service Category
            </label>
            <select
              value={filterServiceCategory}
              onChange={(e) => setFilterServiceCategory(e.target.value)}
              className="p-2 border border-gray-300 w-full min-w-[150px]"
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
              className="p-2 border border-gray-300 w-full min-w-[120px]"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop/tablet table (hidden on mobile) */}
      <div className="hidden sm:block">
        <div className="rounded-lg overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">Name</th>
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">Phone</th>
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">Mail id</th>
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">Category</th>
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">Business hours</th>
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">Status</th>
                  <th className="p-2 sm:p-4 text-left font-semibold text-xs sm:text-base">More</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <Fragment key={app.id}>
                    <tr className="hover:bg-white transition ease-out duration-250">
                      <td className="p-2 sm:p-4">
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
                          <span className="truncate max-w-[100px]">{app.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-4">{app.phone || "N/A"}</td>
                      <td className="p-2 sm:p-4">{app.email || "N/A"}</td>
                      <td className="p-2 sm:p-4">
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
                      <td className="p-2 sm:p-4">{app.business_hours || "N/A"}</td>
                      <td className="p-2 sm:p-4">
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
                      <td className="p-2 sm:p-4 text-center">
                        <button
                          className={`cursor-pointer px-2 py-1 rounded transition-all duration-200 ${
                            expandedId === app.id
                              ? "bg-blue-100 text-blue-700"
                              : "hover:bg-blue-50"
                          }`}
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
                        className="transition-all duration-500 overflow-hidden bg-gray-50"
                      >
                        <div
                          className={`${
                            expandedId === app.id
                              ? "max-h-[1000px] p-2 sm:p-5"
                              : "max-h-0 p-0"
                          } transition-all duration-300 ease-in-out overflow-hidden`}
                        >
                          <div className="border border-gray-300 rounded-lg shadow-lg p-4 sm:p-6 space-y-2 max-w-full sm:max-w-2xl mx-auto bg-white">
                            {app.service_type && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Type:</strong>
                                <span>{app.service_type}</span>
                              </div>
                            )}
                            {app.name && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Name:</strong>
                                <span>{app.name}</span>
                              </div>
                            )}
                            {app.phone && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Phone:</strong>
                                <span>{app.phone}</span>
                              </div>
                            )}
                            {app.location && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Location:</strong>
                                <span>{app.location}</span>
                              </div>
                            )}
                            {app.email && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Email:</strong>
                                <span>{app.email}</span>
                              </div>
                            )}
                            {app.service_category && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Service Category:</strong>
                                <span>{app.service_category}</span>
                              </div>
                            )}
                            {app.category && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Category:</strong>
                                <span>{app.category}</span>
                              </div>
                            )}
                            {app.aadhar_id && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Aadhar ID:</strong>
                                <span>
                                  {app.aadhar_id.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")}
                                </span>
                              </div>
                            )}
                            {app.medical_speciality && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Medical Speciality:</strong>
                                <span>{app.medical_speciality}</span>
                              </div>
                            )}
                            {app.hospitalName && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Hospital Name:</strong>
                                <span>{app.hospitalName}</span>
                              </div>
                            )}
                            {app.business_name && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Business Name:</strong>
                                <span>{app.business_name}</span>
                              </div>
                            )}
                            {app.business_hours && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Business Hours:</strong>
                                <span>{app.business_hours}</span>
                              </div>
                            )}
                            {app.business_address && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Business Address:</strong>
                                <span>{app.business_address}</span>
                              </div>
                            )}
                            {app.googleMapLink && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">GMap link:</strong>
                                <span>{app.googleMapLink}</span>
                              </div>
                            )}
                            {app.created_at && (
                              <div className="flex justify-between">
                                <strong className="font-semibold">Listed on:</strong>
                                <span>
                                  {new Date(app.created_at).toLocaleDateString("en-GB")}
                                </span>
                              </div>
                            )}
                            {(app.status === "rejected" && app.rejected_by) || (app.status !== "rejected" && app.approved_by) ? (
                              <div className="flex justify-between">
                                <strong className="font-semibold">
                                  {app.status === "rejected" ? "Rejected by:" : "Approved by:"}
                                </strong>
                                <span>
                                  {app.status === "rejected"
                                    ? app.rejected_by
                                    : app.approved_by}
                                </span>
                              </div>
                            ) : null}

                            {editId === app.id ? (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const adminToken = localStorage.getItem("adminToken");
                                  if (!adminToken) {
                                    toast.error("Admin token is missing! Please log in.");
                                    return;
                                  }
                                  try {
                                    await axios.put(
                                      `${import.meta.env.VITE_BACKEND_URL}/api/admin/edit/${app.id}`,
                                      editForm,
                                      {
                                        headers: { Authorization: `Bearer ${adminToken}` }
                                      }
                                    );
                                    toast.success("Application updated!");
                                    setEditId(null);
                                    fetchApplications();
                                  } catch (err) {
                                    console.error("Error updating application:", err);
                                    toast.error("Failed to update.");
                                  }
                                }}
                                className="space-y-2"
                              >
                                <input
                                  className="w-full p-2 border rounded"
                                  value={editForm.name || ""}
                                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                  placeholder="Name"
                                />
                                <input
                                  className="w-full p-2 border rounded"
                                  value={editForm.phone || ""}
                                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                  placeholder="Phone"
                                />
                                <input
                                  className="w-full p-2 border rounded"
                                  value={editForm.location || ""}
                                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                  placeholder="Location"
                                />
                                <input
                                  className="w-full p-2 border rounded"
                                  value={editForm.email || ""}
                                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                  placeholder="Email"
                                />
                                <input
                                  className="w-full p-2 border rounded"
                                  value={editForm.googleMapLink || ""}
                                  onChange={e => setEditForm({ ...editForm, googleMapLink: e.target.value })}
                                  placeholder="https://maps.app.goo.gl/LAjuAA1qhrZQZaQy9"
                                />
                                {/* --- Status Dropdown --- */}
                                <select
                                  className="w-full p-2 border rounded"
                                  value={editForm.status || ""}
                                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                >
                                  <option value="">Select Status</option>
                                  <option value="approved">Approved</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="pending">Pending</option>
                                </select>
                                {/* --- End Status Dropdown --- */}
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    className="bg-blue-500 text-white rounded px-4 py-2"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="bg-gray-300 rounded px-4 py-2"
                                    onClick={() => setEditId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                className="mt-4 text-blue-900 bg-blue-100 rounded-lg p-2 w-full hover:bg-blue-200 transition"
                                onClick={() => {
                                  setEditId(app.id);
                                  setEditForm(app);
                                }}
                              >
                                Edit Data
                              </button>
                            )}

                            <button
                              className="mt-2 text-red-900 bg-red-100 rounded-lg p-2 w-full hover:bg-red-200 transition"
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

      {/* Mobile-only list (shows only on mobile) */}
      <div className="block sm:hidden">
  {filteredApplications.map((app) => (
    <div key={app.id} className="mb-3">
      <div
        className="rounded-lg shadow px-4 py-3 flex items-center cursor-pointer"
        onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
      >
        <img
          src={
            app.image ||
            "https://res.cloudinary.com/dhcfcubwa/image/upload/v1740481737/nooho00u6zzhbhqtzbxv.png"
          }
          alt={app.name || "User"}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <span className="font-semibold text-base flex-1">{app.name || "Unknown"}</span>
        <span className="text-blue-700 text-lg">{expandedId === app.id ? "▲" : "▼"}</span>
      </div>
      {expandedId === app.id && (
        <div className="w-full mt-1 bg-gray-50 rounded-b-lg p-3 shadow-inner">
          {app.phone && (
            <div className="flex justify-between">
              <strong className="font-semibold">Phone:</strong>
              <span>{app.phone}</span>
            </div>
          )}
          {app.email && (
            <div className="flex justify-between">
              <strong className="font-semibold">Email:</strong>
              <span>{app.email}</span>
            </div>
          )}
          {app.category && (
            <div className="flex justify-between">
              <strong className="font-semibold">Category:</strong>
              <span>{app.category}</span>
            </div>
          )}
          {app.business_hours && (
            <div className="flex justify-between">
              <strong className="font-semibold">Business Hours:</strong>
              <span>{app.business_hours}</span>
            </div>
          )}
          {app.status && (
            <div className="flex justify-between">
              <strong className="font-semibold">Status:</strong>
              <span>{app.status}</span>
            </div>
          )}
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  ))}
</div>
    </div>
  );
};

export default Profile;
