import { FastifyInstance, onRequestHookHandler } from "fastify";

export const securitySchema = [{ bearerAuth: [] }];

export function routeWith(
  routes: (app: FastifyInstance, options: Object) => Promise<void> | void,
  tag: string,
  auth?: boolean | string[]
) {
  return async (instance: FastifyInstance, options: Object) => {
    instance.addHook("onRoute", (routeOptions) => {
      routeOptions.schema = {
        ...routeOptions.schema,
        tags: [tag],
        ...(auth ? { security: securitySchema } : {}),
      };

      const currentOnRequest: onRequestHookHandler[] = Array.isArray(
        routeOptions.onRequest
      )
        ? routeOptions.onRequest
        : routeOptions.onRequest
        ? [routeOptions.onRequest]
        : [];

      if (auth) {
        if (Array.isArray(auth)) {
          currentOnRequest.push(instance.authRole(auth));
        } else {
          currentOnRequest.push(instance.auth);
        }
      }

      routeOptions.onRequest = currentOnRequest;
    });

    await routes(instance, options);
  };
}
