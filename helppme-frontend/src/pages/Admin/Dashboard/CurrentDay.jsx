import { useState, useEffect } from "react";

export function useDateTime() {
  const [dateTime, setDateTime] = useState({
    day: "",
    date: "",
    month: "",
    year: "",
    time: ""
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "long",
        year: "numeric",
        weekday: "long"
      };
      const optionsTime = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // For real-time updates
        hour12: true
      };

      const formattedDate = now.toLocaleDateString("en-IN", optionsDate);
      const formattedTime = now
        .toLocaleTimeString("en-IN", optionsTime)
        .replace(" am", " AM")
        .replace(" pm", " PM");

      const [day, date, month, year] = formattedDate.split(" ");
      setDateTime({ day, date, month, year, time: formattedTime });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return dateTime;
}
