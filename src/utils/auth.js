export const isAuthenticated = () => !!localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role");
