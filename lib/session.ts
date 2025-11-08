import { v4 as uuidv4 } from "uuid";

export const createOrGetSession = () => {
    if (typeof window === "undefined") return null;

    // Check if session already exists
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = uuidv4(); // Create unique session ID
        localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
};
