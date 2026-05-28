// Central API base URL
// In production (Vercel), VITE_API_URL = "https://iiit-lucknow-mess-92jt.onrender.com"
// In dev, it's empty so vite proxy handles it via localhost:8080
const API_BASE = import.meta.env.VITE_API_URL || "";

export default API_BASE;
