import { v4 as uuidv4 } from "uuid";

export const createOrGetSession = () => {
    if (typeof window === "undefined") return null;

    // Check if session already exists
    // Run only in browser
    let sessionId;
    if (typeof window !== "undefined") {
        sessionId = localStorage.getItem("sessionId");
    }
    if (!sessionId) {
        sessionId = uuidv4(); // Create unique session ID
        // Run only in browser
        if (typeof window !== "undefined") {
            localStorage.setItem("sessionId", sessionId);
        }
    }
    return sessionId;
};
