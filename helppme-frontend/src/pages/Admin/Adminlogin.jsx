import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MutatingDots } from "react-loader-spinner";
import toast from "react-hot-toast";
import NetworkStatus from "../../store/NetworkStatus";

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [securityCode, setSecurityCode] = useState(["", "", "", "", "", ""]);
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();

  const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE;
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  // Handle security code input
  const handleSecurityInput = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const newCode = [...securityCode];
    newCode[idx] = val;
    setSecurityCode(newCode);

    // Move to next input
    if (idx < 5 && val) {
      inputRefs[idx + 1].current.focus();
    }
  };

  const handleSecurityKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (securityCode[idx]) {
        // Clear current
        const newCode = [...securityCode];
        newCode[idx] = "";
        setSecurityCode(newCode);
      } else if (idx > 0) {
        // Move to previous
        inputRefs[idx - 1].current.focus();
      }
    }
  };

  const handleSecurityPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length) {
      setSecurityCode(paste.split("").concat(Array(6).fill("")).slice(0, 6));
      setTimeout(() => {
        const nextIdx = Math.min(paste.length, 5);
        inputRefs[nextIdx].current.focus();
      }, 10);
    }
    e.preventDefault();
  };

  const handleSecurityCodeSubmit = (e) => {
    e.preventDefault();
    const code = securityCode.join("");
    if (code === SECURITY_CODE) {
      setAccessGranted(true);
    } else {
      toast.error("Invalid security code. Access denied.");
      setSecurityCode(["", "", "", "", "", ""]);
      inputRefs[0].current.focus();
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
    }, 1200);

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // --- UI ---
  if (!accessGranted) {
    return (
      <>
        <NetworkStatus />
        {isLoading ? (
          <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300">
            <MutatingDots
              visible={true}
              height="100"
              width="100"
              color="#0175F3"
              secondaryColor="#0175F3"
            />
          </div>
        ) : (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 via-blue-700/80 to-blue-400/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-2xl p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg border border-blue-200">
              {/* Logo Section */}
              <div className="flex justify-center mb-6">
                <img
                  src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1742617856/logo_p0irkv.svg"
                  alt="Company Logo"
                  className="h-16 w-36 sm:h-20 sm:w-40 md:h-24 md:w-44 object-contain drop-shadow-xl"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-center text-blue-800 mb-2 tracking-tight">
                Security Verification
              </h2>
              <p className="text-center text-blue-500 mb-6 text-base">
                Enter the security code to access the admin panel.
              </p>
              <form onSubmit={handleSecurityCodeSubmit} className="space-y-7">
                <div>
                  <label className="block text-blue-700 font-semibold mb-3 text-center">
                    6-Digit Security Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {securityCode.map((num, idx) => (
                      <input
                        key={idx}
                        ref={inputRefs[idx]}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={num}
                        autoFocus={idx === 0}
                        onChange={(e) => handleSecurityInput(e, idx)}
                        onKeyDown={(e) => handleSecurityKeyDown(e, idx)}
                        onPaste={handleSecurityPaste}
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-2xl sm:text-3xl text-center rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200 shadow-md font-bold tracking-widest ${num
                          ? "animate-pulse border-blue-400 bg-blue-50"
                          : "bg-blue-50"
                          }`}
                        style={{
                          transition: "box-shadow 0.2s, border-color 0.2s, background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all duration-200"
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
        <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300">
          <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#0175F3"
            secondaryColor="#0175F3"
          />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400">
          <div className="bg-white/95 backdrop-blur-2xl p-8 md:p-12 rounded-3xl shadow-2xl w-155 border border-blue-200">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://res.cloudinary.com/dhcfcubwa/image/upload/v1740797487/z6wgxw2xcwrzpgjgyhwg.svg"
                alt="Admin Profile Pic"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-4 border-blue-200"
              />
              <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 mt-4 mb-2 tracking-tight">
                Welcome to Admin Panel!
              </h2>
              <p className="text-blue-500 text-center mb-2">
                Please login to continue
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-blue-700 font-semibold mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-lg transition"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-blue-700 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 text-lg transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all duration-200"
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
