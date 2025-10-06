import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";

import { BrowserRouter, Route, Routes } from "react-router";

// pages
import Home from "@/pages/home";

import Authentication from "@/pages/authentication";
import AccountVerification from "@/pages/authentication/account-verification";
import GoogleVerification from "@/pages/authentication/google-verification";

import Dashboard from "@/pages/dashboard";
import { ProtectedRoute } from "@/components/protected";

const App = () => {
    return (
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    {/* home route */}
                    <Route path="/" element={<Home />} />

                    {/* register / login in your account, and email verification */}
                    <Route path="/authentication" element={<Authentication />} />
                    <Route path="/account-verification/:token" element={<AccountVerification />} />
                    <Route path="/google-verification/:token" element={<GoogleVerification />} />

                    {/* your account dashboard */}
                    <Route path="/dashboard" element={<ProtectedRoute children={<Dashboard />} />} />
                </Routes>
            </BrowserRouter>
        </StrictMode>
    );
};

createRoot(document.getElementById("root")!).render(<App />);
