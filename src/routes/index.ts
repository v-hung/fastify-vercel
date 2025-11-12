import { FastifyInstance } from "fastify";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import { routeWith } from "../utils/router.utils.js";

export default async function registerRoutes(app: FastifyInstance) {
  app.register(routeWith(authRoutes, "auth"), { prefix: "/auth" });
  app.register(routeWith(userRoutes, "user", true), { prefix: "/users" });
}
