import { FastifyInstance } from "fastify";
import * as authController from "../controllers/auth.controller.js";
import {
  loginBodySchema,
  loginResponseSchema,
} from "../schemas/auth/login.schema.js";
import { userSelectSchema, userUpdateSchema } from "../db/schema/index.js";
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

  app.post(
    "/register",
    {
      schema: {
        body: loginBodySchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    authController.register
  );

  app.put(
    "/update",
    {
      schema: {
        body: userUpdateSchema,
        response: {
          200: userSelectSchema,
        },
      },
    },
    authController.update
  );
}

export default routes;
