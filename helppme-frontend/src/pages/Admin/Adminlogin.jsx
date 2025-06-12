import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MutatingDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import NetworkStatus from "../../store/NetworkStatus";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [securityCode, setSecurityCode] = useState("");
  const [showSecurityCodeModal, setShowSecurityCodeModal] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();

  const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE;

  const handleSecurityCodeSubmit = (e) => {
    e.preventDefault();
    if (securityCode === SECURITY_CODE) {
      setAccessGranted(true);
      setShowSecurityCodeModal(false);
    } else {
      toast.error("Invalid security code. Access denied.");
      setSecurityCode("");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      toast.error("No network connection. Please check your internet!");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        formData
      );
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("Company", response.data.username);
      toast.success("Login Successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Credentials!");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (!accessGranted) {
    return (
      <>
        <NetworkStatus/>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 z-50">
  <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
    {/* Logo Section */}
    <div className="flex justify-center mb-6">
      <img src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1742617856/logo_p0irkv.svg" alt="Company Logo" className="h-16 w-36 sm:h-20 sm:w-40 md:h-24 md:w-44 lg:h-30 lg:w-68" />
    </div>

    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-4">
    Security Verification
    </h2>
    
                
    <p className="text-center text-gray-600 mb-6">
      Enter the security code to access this page.
    </p>

    <form onSubmit={handleSecurityCodeSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          6-Digit Security Code
        </label>
        <input
          type="password"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          placeholder="Enter 6-digit code"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          maxLength={6}
          pattern="\d{6}"
          title="Please enter exactly 6 digits"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#3c42f0] text-white py-2 rounded-lg font-semibold hover:bg-[#5257f7] transition"
      >
        Verify Code
      </button>
    </form>
  </div>
</div>
        )}
      </>
    );
  }

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
          No Network Connection. Please check your internet!
        </div>
      )}

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
        <div className="min-h-screen flex items-center justify-center bg-[#007bff]">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img
                src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740797487/z6wgxw2xcwrzpgjgyhwg.svg"
                alt="Admin Profile Pic"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center text-black-700 mb-6">
            Welcome to Admin Panel!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLogin;
