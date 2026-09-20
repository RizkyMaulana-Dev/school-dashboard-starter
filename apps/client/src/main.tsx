import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";
import { App } from "./app/App";

const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = (envClientId && envClientId.trim() !== "")
    ? envClientId
    : "166439731204-bfjlc8tatm1pq5rh2jiebr7vfbg0gtkh.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={googleClientId}>
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
);
