import { FastifyInstance } from "fastify";
import * as authController from "../controllers/auth.controller.js";
import {
  loginBodySchema,
  loginResponseSchema,
} from "../schemas/auth/login.schema.js";
import { userSelectSchema } from "../db/schema/index.js";
import { securitySchema } from "../utils/router.utils.js";

async function routes(app: FastifyInstance) {
  app.post(
    "/login",
    {
      schema: {
        body: loginBodySchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    authController.login
  );

  app.get(
    "/load",
    {
      schema: {
        security: securitySchema,
        response: {
          200: userSelectSchema,
        },
      },
      onRequest: [app.auth],
    },
    authController.load
  );
}

export default routes;
