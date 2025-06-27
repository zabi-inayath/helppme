import { axiosInstance } from "../lib/axios.js";

export const callCount = async (e, contact) => {
    // Optionally prevent default if needed
    if (!contact || !contact.id) return;
    try {
        await axiosInstance.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/services/call/${contact.id}`
        );
        // Optionally: toast.success("Call count updated!");
    } catch (err) {
        // Optionally: toast.error("Failed to update call count");
        console.error("Error updating call count:", err);
    }
}
