export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Order Service API",
    version: "1.0.0",
    description: "API for managing orders in Food Delivery System",
  },
  paths: {
    "/orders": {
      get: {
        summary: "Get all orders",
        responses: {
          200: { description: "List of all orders" },
        },
      },
      post: {
        summary: "Create a new order",
        responses: {
          201: { description: "Order created" },
        },
      },
    },
    "/orders/{id}": {
      get: {
        summary: "Get order by ID (includes user & restaurant info)",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: { description: "Order detail" } },
      },
      delete: {
        summary: "Delete order by ID",
        parameters: [{ name: "id", in: "path", required: true }],
      },
    },
    "/orders/{id}/status": {
      put: {
        summary: "Update order status",
        parameters: [{ name: "id", in: "path", required: true }],
      },
    },
  },
};
