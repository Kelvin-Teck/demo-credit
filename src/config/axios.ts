// src/utils/axiosClient.ts
import axios from "axios";

const adjutorClient = axios.create({
  baseURL: process.env.ADJUTOR_API_BASE_URL, 
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
  },
});

export default adjutorClient;
