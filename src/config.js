// Centralized API base configuration for the React app
// Use VITE_API_BASE_URL to override absolute base (e.g., https://your-backend)
// Default behavior:
// - Development: empty base to use Vite proxy (/api -> localhost backend)
// - Production: default to deployed Railway backend unless overridden

const envBase = (import.meta.env.VITE_API_BASE_URL || "").trim();
const defaultProdBase = "https://web-production-fb658.up.railway.app";
const resolvedBase = envBase || (import.meta.env && import.meta.env.PROD ? defaultProdBase : "");

export const API_BASE = resolvedBase.replace(/\/$/, "");

export const apiUrl = (path) => `${API_BASE}${path}`;


