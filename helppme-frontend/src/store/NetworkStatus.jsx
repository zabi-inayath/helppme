// store/NetworkStatus.jsx
import { useEffect, useState } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    !isOnline && (
      <div className="fixed inset-0 z-[999] backdrop-blur-md bg-black/40 flex items-center justify-center">
        <div className="bg-white text-black p-6 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-semibold mb-2">
            No Internet Connection
          </h2>
          <p className="text-gray-600">
            Please check your network and try again.
          </p>
        </div>
      </div>
    )
  );
};

export default NetworkStatus;
