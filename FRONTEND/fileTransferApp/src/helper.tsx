import axios from "axios";

export const receiveapi = axios.create({
  baseURL: import.meta.env.VITE_RECEIVE_API_URL,
});



export const sendapi = axios.create({
  baseURL: import.meta.env.VITE_SEND_API_URL,
});

