import { useEffect, useState, useRef } from "react";
import { Home, User, Gift, LogOut, Menu } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDateTime } from "./CurrentDay";
import PendingApplications from "./Pendingapplication";
import { MutatingDots } from "react-loader-spinner";
import Profile from "./Profile";
import toast from "react-hot-toast";
import NetworkStatus from "../../../store/NetworkStatus";

// Transparent scrollbar CSS (add to global CSS if you want it everywhere)
const transparentScrollbarStyle = `
  ::-webkit-scrollbar { width: 8px; background: transparent; }
  ::-webkit-scrollbar-thumb { background: transparent; }
  * { scrollbar-width: thin; scrollbar-color: transparent transparent; }
`;

const Sidebar = ({
  setActivePage,
  activePage,
  isSidebarOpen,
  toggleSidebar
}) => {
  const navigate = useNavigate();

  // Fetch Admin Details (Mock or API call)
  const [adminDetails, setAdminDetails] = useState({
    username: "",
    profilePic: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        toast.error("Please log in...");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setAdminDetails({
          username: response.data.admin.name || "Helppme",
          profilePic:
            response.data.admin.profilePic ||
            "https://res.cloudinary.com/dhcfcubwa/image/upload/v1740481737/nooho00u6zzhbhqtzbxv.png"
        });
        localStorage.setItem("adminName", response.data.admin.name);
      } catch (error) {
        setAdminDetails({
          username: "Admin",
          profilePic:
            "https://res.cloudinary.com/dhcfcubwa/image/upload/v1740481737/nooho00u6zzhbhqtzbxv.png"
        });
      }
    };
    fetchAdminDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
    toast.success("Logged out Successfully");
  };

  return (
    <>
      <div
        className={`w-64 h-screen bg-gray-100 p-5 flex flex-col justify-between fixed md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-50`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}>
          <div className="flex items-center space-x-3">
            <img
              src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740797487/z6wgxw2xcwrzpgjgyhwg.svg"
              alt="Helppme Logo"
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
          </div>
          <nav className="mt-5">
            <button
              className={`flex items-center space-x-3 p-3 rounded-lg w-full ${
                activePage === "home"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setActivePage("home");
                toggleSidebar();
              }}
            >
              <Home size={20} /> <span>Home</span>
            </button>
            <button
              className={`flex items-center space-x-3 p-3 rounded-lg w-full ${
                activePage === "profiles"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setActivePage("profiles");
                toggleSidebar();
              }}
            >
              <User size={20} /> <span>Profiles</span>
            </button>
            <button
              className={`flex items-center space-x-3 p-3 rounded-lg w-full ${
                activePage === "donations"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setActivePage("donations");
                toggleSidebar();
              }}
            >
              <Gift size={20} /> <span>Donations</span>
            </button>
          </nav>
        </div>
        <div className="flex items-center space-x-12 w-full rounded-lg mb-5">
          <div className="flex items-center">
            <img
              src={adminDetails.profilePic}
              alt={adminDetails.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-800">
                {adminDetails.username}
              </p>
              <p className="text-[12px] text-gray-500">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white text-[12px] py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const users = ["M"];
  const dateTime = useDateTime();
  const [approvedUsers, setApprovedUsers] = useState(0);
  const [usersImages, setUsersImages] = useState([]);
  const [rejectedImage, setRejectedImage] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState(0);

  // Ref for main content to detect outside click for hamburger
  const mainRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [approvedResponse, rejectedResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/services/enroll/approved`
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/services/enroll/rejected`
          )
        ]);
        setApprovedUsers(approvedResponse.data.data.length);
        setUsersImages(approvedResponse.data.data);
        setRejectedUsers(rejectedResponse.data.data.length);
        setRejectedImage(rejectedResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getRandomColor = (index) => {
    const colors = ["#0F3D2E", "#021B46", "#40062C", "#1B1B1B", "#4A235A"];
    return colors[index % colors.length];
  };

  return (
    <>
      {/* Inject transparent scrollbar style */}
      <style>{transparentScrollbarStyle}</style>
      <NetworkStatus />
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#0175F3"
            secondaryColor="#0175F3"
          />
        </div>
      ) : (
        <div className="flex h-screen bg-gray-100">
          {/* Hamburger Menu for Mobile */}
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 p-2 bg-blue-500 text-white rounded-lg md:hidden z-50"
          >
            <Menu size={24} />
          </button>

          {/* Sidebar */}
          <Sidebar
            setActivePage={setActivePage}
            activePage={activePage}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          {/* Main Content */}
          <div
            className="flex-1 overflow-y-auto p-2 pt-18 sm:p-4 md:p-6"
            ref={mainRef}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent"
            }}
          >
            {activePage === "home" && (
              <div className="flex flex-col md:flex-row h-full bg-gray-100">
                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                  {/* Mobile-only time/day card */}
                  <div className="block md:hidden mb-4">
                    <div className="flex flex-row text-white rounded-lg text-center">
                      <div className="bg-[#0175F3] text-white w-full p-4 m-2 mb-0 sm:mb-2 sm:mr-2 rounded-lg text-center">
                        <p className="font-semibold text-5xl">{dateTime.date}</p>
                        <p className="font-semibold text-3xl">{dateTime.month}</p>
                        <p className="font-semibold text-2xl">{dateTime.year}</p>
                      </div>
                      <div className="bg-[#0175F3] text-white w-full p-4 m-2 mb-0 sm:mb-2 sm:mr-2 rounded-lg text-center">
                        <p className="text-2xl font-semibold text-left">
                          It's
                        </p>
                        <p className="font-semibold mb-14 text-3xl text-left">
                          {dateTime.day}
                        </p>
                        <p className="text-xs font-semibold text-right">
                          {dateTime.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Recent Activities heading: hidden on mobile, visible on md+ */}
                  <h2 className="hidden md:block text-xl sm:text-2xl font-bold">
                    Recent Activities
                  </h2>
                  {/* Hide this div on 768px and below */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 hidden md:grid">
                    {/* Approved Applications */}
                    <div className="bg-white p-6 md:p-12 rounded-lg shadow-md text-center">
                      <p className="text-gray-500 mb-3">
                        Applications Approved
                      </p>
                      <div className="flex items-center mb-3 justify-center">
                        <div className="flex -space-x-2">
                          {usersImages.slice(0, 3).map((user, index) => (
                            <img
                              key={index}
                              src={user.image}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-gray-700 text-s">
                          +{usersImages.length > 3 ? usersImages.length - 3 : 0}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {approvedUsers}
                      </p>
                    </div>

                    {/* Rejected Applications */}
                    <div className="bg-white p-6 md:p-12 rounded-lg shadow-md text-center">
                      <p className="text-gray-500 mb-3">
                        Applications Rejected
                      </p>
                      <div className="flex items-center mb-3 justify-center">
                        <div className="flex -space-x-2">
                          {rejectedImage.slice(0, 3).map((user, index) => (
                            <img
                              key={index}
                              src={user.image}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-gray-700 text-s">
                          +
                          {rejectedImage.length > 3
                            ? rejectedImage.length - 3
                            : 0}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {rejectedUsers}
                      </p>
                    </div>

                    {/* Donation Activity */}
                    <div className="bg-white p-6 md:p-12 rounded-lg shadow-md text-center">
                      <p className="text-gray-500">Donation Activity</p>
                      <div className="flex items-center mb-5 mt-2 justify-center">
                        <div className="flex -space-x-2">
                          {users.map((initial, index) => (
                            <div
                              key={index}
                              className="w-12 h-12 flex items-center justify-center rounded-full text-white text-lg"
                              style={{ backgroundColor: getRandomColor(index) }}
                            >
                              {initial}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-green-600">
                        +₹300 Credited
                      </p>
                    </div>
                  </div>

                  {/* New Registrars */}
                  <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold">New Registrars</h2>
                  <PendingApplications />
                </main>

                {/* Right Sidebar */}
                <aside className="w-full md:w-78 p-6 space-y-4 hidden md:block">
                  <div className="flex flex-col md:flex-row text-white rounded-lg text-center">
                    <div className="bg-[#0175F3] text-white h-30 w-full md:w-50 p-4 mb-4 md:mb-0 md:mr-2 rounded-lg text-center">
                      <p className="font-semibold text-4xl">{dateTime.date}</p>
                      <p className="font-semibold text-lg">{dateTime.month}</p>
                      <p className="font-semibold text-xs">{dateTime.year}</p>
                    </div>
                    <div className="bg-[#0175F3] text-white p-4 rounded-lg text-center">
                      <p className="text-lg font-semibold mb-3 mr-6 text-left">
                        It's {dateTime.day}
                      </p>
                      <p className="text-xs font-semibold text-right">
                        {dateTime.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#6A6A6A] font-semibold">
                    Marketing and Audience Reach
                  </p>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1742440159/card1_tvbbg2.svg"></img>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1742440345/card2_uxrlvs.svg"></img>
                  <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1742440344/card3_l67k0r.svg"></img>
                </aside>
              </div>
            )}
            {activePage === "profiles" && (
              <div>
                <Profile />
              </div>
            )}
            {activePage === "donations" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Donations Section</h1>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
