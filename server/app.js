import "dotenv/config";
import { connectDB } from "./src/config/connect.js";
import fastify from "fastify";
import { PORT } from "./src/config/config.js";
import fastifySocketIO from "fastify-socket.io";
// dotenv.config();
import { registerRoutes } from "./src/routes/index.js";
import {buildAdminRouter} from "./src/config/setup.js"
const start = async () => {
  await connectDB(process.env.MONGO_URI);
  const app = fastify();
  app.register(fastifySocketIO, {
    cors: { origin: "*" },
    transports: ["websocket"],
  });
  await registerRoutes(app);

  await buildAdminRouter(app);
  app.listen({ port: PORT, host: "0.0.0.0" }, (error, adder) => {
    if (error) {
      console.log("error in listing app", error);
    } else {
      console.log("Grocery app started on port", PORT);
    }
  });

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("User Connected");
      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log("User joined room", orderId);
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
    });
  });
};

start();
