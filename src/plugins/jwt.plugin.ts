import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    auth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    authRole(
      roles: string[]
    ): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number; email: string; role: string };
    user: { id: number; email: string; role: string };
  }
}

export default fp(async function (fastify: FastifyInstance, opts: any) {
  const fastifyJwt = (await import("@fastify/jwt")).default;
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SIGNING_SECRET || "default_secret",
  });

  // Decorate authenticate method
  fastify.decorate(
    "auth",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ message: "Unauthorized" });
      }
    }
  );

  // Decorate authenticate method
  fastify.decorate("authRole", function (roles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();

        if (!roles.includes(request.user.role)) {
          reply.status(403).send({ message: "Forbidden" });
        }
      } catch (err) {
        reply.status(401).send({ message: "Unauthorized" });
      }
    };
  });
});
