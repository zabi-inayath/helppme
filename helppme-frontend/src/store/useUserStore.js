import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";

export const useUserStore = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/services/enroll/approved");
        setData(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Axios request failed:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return { data, loading, error };
};
