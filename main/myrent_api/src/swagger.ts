import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ETNAir API",
      version: "1.0.0",
      description: "API Node.js / Express / Prisma / PostgreSQL pour ETNAir",
    },

    servers: [
      { url: "http://localhost:3000", description: "Local" },
      // Optionnel 
      // { url: "http://<IP_MACHINE>:3000", description: "Remote / LAN" },
    ],

    tags: [
      { name: "Auth", description: "Authentication (register/login)" },
      { name: "Me", description: "Authenticated user info" },
      { name: "Properties", description: "Properties (annonces/logements)" },
      { name: "Bookings", description: "Reservations (bookings) workflow" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },

      schemas: {
        // ---------- Common ----------
        ErrorResponse: {
          type: "object",
          properties: { error: { type: "string", example: "Forbidden" } },
          required: ["error"],
        },

        // ---------- User ----------
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "6ed6d01b-36d5-439a-978d-300b2e7b3cf0" },
            first_name: { type: "string", example: "Karl" },
            last_name: { type: "string", example: "Yegbe" },
            email: { type: "string", format: "email", example: "karl@test.com" },
            role: { type: "string", enum: ["TENANT", "OWNER", "ADMIN"], example: "OWNER" },
            created_at: { type: "string", format: "date-time" },
          },
          required: ["id", "first_name", "last_name", "email", "role"],
        },

        MeResponse: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                role: { type: "string", enum: ["TENANT", "OWNER", "ADMIN"] },
                email: { type: "string", format: "email" },
              },
              required: ["id", "role", "email"],
            },
          },
          required: ["user"],
        },

        // ---------- Auth ----------
        AuthRegisterBody: {
          type: "object",
          required: ["first_name", "last_name", "email", "password"],
          properties: {
            first_name: { type: "string", example: "Karl" },
            last_name: { type: "string", example: "Yegbe" },
            email: { type: "string", format: "email", example: "karl@test.com" },
            password: { type: "string", example: "Password123!" },
            role: { type: "string", enum: ["TENANT", "OWNER"], example: "OWNER" },
          },
        },

        AuthLoginBody: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "karl@test.com" },
            password: { type: "string", example: "Password123!" },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: { $ref: "#/components/schemas/User" },
          },
          required: ["token", "user"],
        },

        // ---------- Properties ----------
        Property: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            owner_id: { type: "string", format: "uuid" },
            title: { type: "string", example: "Studio cosy centre-ville" },
            description: { type: "string", nullable: true, example: "Proche métro, lumineux" },
            price_per_night: { type: "string", example: "49.99" },
            city: { type: "string", example: "Paris" },
            address: { type: "string", nullable: true, example: "10 rue Exemple" },
            max_guests: { type: "integer", minimum: 1, example: 2 },

        
            image_url: {
              type: "string",
              nullable: true,
              format: "uri",
              example: "https://example.com/images/property-1.jpg",
            },

            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
          required: ["id", "owner_id", "title", "price_per_night", "city", "max_guests", "created_at", "updated_at"],
        },


      PropertyCreateBody: {
        type: "object",
        required: ["title", "city", "price_per_night"],
        properties: {
          title: { type: "string", example: "Studio cosy centre-ville" },
          description: { type: "string", nullable: true, example: "Proche métro, lumineux" },
          price_per_night: { type: "number", example: 49.99 },
          city: { type: "string", example: "Paris" },
          address: { type: "string", nullable: true, example: "10 rue Exemple" },
          max_guests: { type: "integer", minimum: 1, example: 2 },

      
          image_url: {
            type: "string",
            nullable: true,
            format: "uri",
            example: "https://example.com/images/property-1.jpg",
          },
        },
      },


              PropertyUpdateBody: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string", nullable: true },
            price_per_night: { type: "number" },
            city: { type: "string" },
            address: { type: "string", nullable: true },
            max_guests: { type: "integer", minimum: 1 },

            image_url: {
              type: "string",
              nullable: true,
              format: "uri",
              example: "https://example.com/images/property-2.jpg",
            },
          },
        },

        // ---------- Bookings ----------
        Booking: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            tenant_id: { type: "string", format: "uuid" },
            property_id: { type: "string", format: "uuid" },
            start_date: { type: "string", format: "date", example: "2025-12-20" },
            end_date: { type: "string", format: "date", example: "2025-12-23" },
            total_price: { type: "string", example: "149.97" },
            status: { type: "string", enum: ["PENDING", "CONFIRMED", "CANCELLED"], example: "PENDING" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
          required: ["id", "tenant_id", "property_id", "start_date", "end_date", "total_price", "status", "created_at", "updated_at"],
        },

        BookingCreateBody: {
          type: "object",
          required: ["property_id", "start_date", "end_date"],
          properties: {
            property_id: { type: "string", format: "uuid", example: "5aca8eff-2b17-4d6f-befb-970b842b7f36" },
            start_date: { type: "string", format: "date", example: "2025-12-20" },
            end_date: { type: "string", format: "date", example: "2025-12-23" },
          },
        },

        BookingWithPropertyLite: {
          allOf: [
            { $ref: "#/components/schemas/Booking" },
            {
              type: "object",
              properties: {
                properties: {
                  type: "object",
                  properties: {
                    id: { type: "string", format: "uuid" },
                    title: { type: "string" },
                    city: { type: "string" },
                    price_per_night: { type: "string" },
                  },
                  required: ["id", "title", "city", "price_per_night"],
                },
              },
            },
          ],
        },
      },
    },

    // Par défaut: protégé. Les routes publiques feront `security: []`
    security: [{ bearerAuth: [] }],
  },

  apis: ["./src/routes/*.ts"],
});
