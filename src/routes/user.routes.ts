import { FastifyInstance } from "fastify";
import * as userController from "../controllers/user.controller.js";
import z from "zod";
import {
  userInsertSchema,
  userSelectSchema,
  userUpdateSchema,
} from "../db/schema/index.js";
import { paginationQuerySchema } from "../schemas/auth/pagination.schema.js";
import { paginatedUserSchema } from "../schemas/user/user.schema.js";

async function routes(app: FastifyInstance) {
  app.get(
    "",
    {
      schema: {
        response: {
          200: userSelectSchema.array(),
        },
      },
    },
    userController.getAllUsers
  );

  app.post(
    "/search",
    {
      schema: {
        body: paginationQuerySchema,
        response: {
          200: paginatedUserSchema,
        },
      },
    },
    userController.searchUsers
  );

  app.get(
    "/:id",
    {
      schema: {
        response: {
          200: userSelectSchema,
        },
      },
    },
    userController.getUserById
  );

  app.post(
    "",
    {
      schema: {
        body: userInsertSchema,
        response: {
          200: userSelectSchema,
        },
      },
    },
    userController.createUser
  );

  app.put(
    "/:id",
    {
      schema: {
        body: userUpdateSchema,
        response: {
          200: userSelectSchema,
        },
      },
    },
    userController.updateUser
  );

  app.delete(
    "/:id",
    {
      schema: {
        response: {
          200: z.boolean(),
        },
      },
    },
    userController.deleteUser
  );
}

export default routes;
