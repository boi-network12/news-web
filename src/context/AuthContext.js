import React, { createContext, useState, useEffect } from "react";
import { API_URL } from "../config/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`${API_URL}/auth/me`, {
                        method: "GET",
                        headers: {
                            "Authorization" : `Bearer ${token}`
                        },
                    });

                    const data = await response.json();
                    if (data) {
                        setUser(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching user details", error);
                toast.error("Error fetching user")
            } finally {
                setLoading(false);
            }
        }

        getCurrentUser();
    }, []);

    //     try {
    //         const response = await fetch(`${API_URL}/auth/me`, {
    //             method: "GET",
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             }
    //         });

    //         const data = await response.json();
    //         if (!response.ok) throw new Error(data.message || "Failed to fetch user details.");

    //         localStorage.setItem("user", JSON.stringify(data.user));
    //         setUser(data.user);
    //     } catch (error) {
    //         toast.error("Failed to fetch user details");
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("user");  // Remove invalid token
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Registration failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            toast.success("Registration successful!");
            return { success: true, user: data.user };
        } catch (error) {
            toast.error(error.message);
            return { success: false, message: error.message };
        }
    };

    const login = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            toast.success("Logged in successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
