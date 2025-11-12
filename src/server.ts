import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import jwtPlugin from "./plugins/jwt.plugin.js";
import registerRoutes from "./routes/index.js";

const PORT = +(process.env.PORT || 3000);

const app = Fastify({
  logger: true,
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>();

// 📌 Đăng ký Swagger
app.register(swagger, {
  openapi: {
    info: {
      title: "Fresh love API",
      description: "API quản lý tủ đồ",
      version: "1.0.0",
    },
    servers: [],
    components: {
      securitySchemes: {
        // JWT qua Authorization header
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
  transformObject: jsonSchemaTransformObject,
});

app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

app.register(cors, {
  origin: (origin, callback) => {
    // Luôn gọi callback(null, true) để chấp nhận mọi Origin
    // và phản hồi lại bằng Origin chính xác mà client đã gửi.
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(jwtPlugin);

app.register(registerRoutes, { prefix: "/api" });

// Run the server!
app.listen({ port: PORT }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
