# NXMS: A Modular Monolith Framework for TypeScript Microservices

NXMS is a TypeScript framework that empowers you to build highly scalable and maintainable applications using a modular monolith architecture. It strikes a balance between the independent deployability of microservices and the simplicity and performance of a monolith, all within a single codebase.

## Why NXMS?

- **Best of Both Worlds:** Enjoy the modularity and independent development of microservices without the complexity of distributed systems.
- **Simplified Development:**  Develop, test, and deploy modules independently while benefiting from the ease of a single codebase.
- **Enhanced Performance:** Eliminate inter-service communication overhead, resulting in faster response times and improved performance.
- **Flexibility and Adaptability:**  Choose your preferred backend framework (Express, Fastify, etc.) and deploy seamlessly to various cloud providers or on-premise servers.

## Core Concepts

- **Modular Monolith:** NXMS applications are structured as a collection of independent modules, each representing a specific business domain or functionality.
- **API Gateway:** The NXMS Gateway (`@nxms/gateway` library) acts as a central entry point for all incoming requests, handling routing, authentication, authorization, and other cross-cutting concerns.
- **Framework Adapters and Agnosticism:**  NXMS provides adapters for popular backend frameworks like Express (`@nxms/framework-express` library), allowing you to leverage your preferred tools and libraries.
- **Server Agnosticism:**  Deploy your NXMS application to any server environment, whether it's a local machine, a cloud provider like AWS or Azure, or a container orchestration platform like Kubernetes.
- **Domain-Driven Design**: Encourages the organization of code around business domains, promoting maintainability and scalability.

## Project Structure

NXMS employs a layered architecture, promoting separation of concerns and maintainability. The core layers include:

- **Apps:** Contains runnable projects, categorized into servers and frontends.
  - **Servers:** Houses server configurations for different environments (local, AWS, Firebase, etc.).
  - **Fronts:** Accommodates frontend applications within the monorepo (currently not extensively defined).
- **Libs:** Comprises reusable modules accessible across the project.
  - **Framework:** Manages backend framework configurations (Express, Fastify, etc.).
  - **Gateway:** Acts as an API gateway, handling routing, authentication, authorization, and module injection.
  - **Core:** Contains the core logic, interface definitions, and fundamental components.
- **Modules:** Represents individual domain groups, each structured with:
  - **Application:** Houses application logic and port definitions.
  - **Domain:** Contains domain entities, interfaces, and repositories.
  - **Infra:** Provides concrete implementations for controllers and interactions with external systems.

## Getting Started

### Prerequisites

- Node.js (version 18.x.x or higher)
- NX (version 18.x.x or higher)

### Installation

1. Install NX globally: `npm install -g nx`
2. Create a new NX workspace: `npx create-nx-workspace@latest`
3. Choose a suitable preset (e.g., "empty workspace") and follow the prompts.

### Creating a Module

1. Generate a new library for the module: `nx g lib --name my-module --directory libs/modules`
2. Define your module's routes, controllers, and other logic within this library.
3. Register your module with the NXMS Gateway by providing its name, port, and routes.

### Creating a Server

1. Generate a new application for the server: `nx g app --name my-server --directory apps`
2. Configure the server to use the desired backend framework (e.g., Express) and retrieve the dynamically generated routes from the NXMS Gateway.

### Running the Application

1. Start the server: `nx serve my-server`

## Example

Let's say you're building an e-commerce application. You could have separate modules for `users`, `products`, `orders`, and `payments`. Each module would handle its own data, logic, and API endpoints. The NXMS Gateway would route incoming requests to the appropriate module based on the path, version, and HTTP method. The framework adapter (e.g., `framework-express`) would then handle the underlying server implementation, creating an Express server instance for each module and exposing the routes.

## Documentation and Resources

- [Structure](./docs/structure.md): Detailed explanation of the project structure
- [Definitions](./docs/definitions.md): Module definitions and specifications
- [12 Factors](./docs/12factors.md): Adherence to the 12-Factor App methodology
- [Code Style](./docs/codeStyle.md): Coding conventions and style guidelines

## Contributing

Contributions to the NXMS framework are welcome! Please refer to the [CONTRIBUTING.md](./docs/CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License.
