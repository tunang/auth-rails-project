import cable from "actioncable";

const token = localStorage.getItem("access_token");

const consumer = cable.createConsumer(
  `${import.meta.env.VITE_APP_API_URL_SOCKET.replace(/^http/, "ws")}/cable?token=${token}`
);

export default consumer;