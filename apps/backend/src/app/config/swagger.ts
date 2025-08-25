import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./index";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ScholarFlow API Documentation",
      version: "1.0.0",
      description: `
        ## AI-Powered Research Paper Collaboration Hub API
        
        ScholarFlow is a comprehensive platform for researchers to upload, organize, and collaborate on academic papers using AI-powered features.
        
        ### Features
        - 🔐 **Authentication**: OAuth (Google, GitHub) + JWT-based auth
        - 📄 **Paper Management**: Upload, extract text, and organize research papers
        - 📚 **Collections**: Create and share paper collections with team members
        - 🤖 **AI Integration**: Vector similarity search with pgvector
        - 👥 **Collaboration**: Real-time collaboration and sharing features
        
        ### Architecture
        - **Backend**: Express.js + TypeScript + Prisma ORM
        - **Database**: PostgreSQL with pgvector extension
        - **Authentication**: JWT with refresh token rotation
        - **File Storage**: Cloud storage integration (AWS S3)
        
        ### Development Phase
        Currently in **Phase 1 MVP Development** - Core authentication and basic features.
      `,
      contact: {
        name: "ScholarFlow Team",
        email: "support@scholarflow.com",
        url: "https://scholar-flow.ai.vercel.app",
      },
      license: {
        name: "UNLICENSED",
        url: "https://github.com/Atik203/Scholar-Flow?tab=License-1-ov-file",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Development server",
      },
      {
        url: "https://scholar-flow.api.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT token in the format **Bearer &lt;token&gt;**",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API key for certain endpoints",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication information is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Unauthorized access",
                  },
                  errorDetails: {
                    type: "object",
                    properties: {
                      issues: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error in request data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Validation failed",
                  },
                  errorDetails: {
                    type: "object",
                    properties: {
                      issues: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            path: {
                              type: "array",
                              items: {
                                type: "string",
                              },
                            },
                            message: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Internal server error",
                  },
                },
              },
            },
          },
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique user identifier",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            image: {
              type: "string",
              format: "uri",
              nullable: true,
              description: "URL to user's profile image",
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              default: "USER",
              description: "User role in the system",
            },
            emailVerified: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Timestamp when email was verified",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last profile update timestamp",
            },
          },
          required: ["id", "email", "name", "role", "createdAt", "updatedAt"],
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            limit: {
              type: "integer",
              description: "Number of items per page",
              example: 10,
            },
            total: {
              type: "integer",
              description: "Total number of items",
              example: 100,
            },
            totalPages: {
              type: "integer",
              description: "Total number of pages",
              example: 10,
            },
          },
          required: ["page", "limit", "total", "totalPages"],
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              description: "Response data (varies by endpoint)",
            },
            meta: {
              $ref: "#/components/schemas/PaginationMeta",
              description: "Pagination metadata (for paginated responses)",
            },
          },
          required: ["success", "message"],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            errorDetails: {
              type: "object",
              description: "Detailed error information",
            },
          },
          required: ["success", "message"],
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User management and profile operations",
      },
      {
        name: "Papers",
        description: "Research paper upload and management",
      },
      {
        name: "Collections",
        description: "Paper collection management and sharing",
      },
      {
        name: "AI Features",
        description: "AI-powered features like similarity search",
      },
      {
        name: "Health",
        description: "System health and monitoring endpoints",
      },
    ],
  },
  apis: [
    "./src/app/modules/**/*.routes.ts", // Path to route files
    "./src/app/modules/**/*.controller.ts", // Path to controller files
    "./src/app/middleware/*.ts", // Path to middleware files
    "./src/server.ts", // Main server file
  ],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  // Setup Swagger UI middleware with explicit casting to resolve type conflicts
  const swaggerRouter = (swaggerUi as any).serve;
  const swaggerSetup = (swaggerUi as any).setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #1f2937; }
      .swagger-ui .scheme-container { background: #f8fafc; }
    `,
    customSiteTitle: "ScholarFlow API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  });

  (app as any).use("/docs", swaggerRouter, swaggerSetup);

  // Raw JSON endpoint for OpenAPI spec
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  console.log(
    `📚 API Documentation available at http://localhost:${config.port}/docs`
  );
  console.log(
    `🔗 OpenAPI JSON spec available at http://localhost:${config.port}/docs.json`
  );
};

export default specs;
