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

For further details review the [Project Structure file](./docs/structure.md)

## Example

Let's say you're building an e-commerce application. You could have separate modules for `users`, `products`, `orders`, and `payments`. Each module would handle its own data, logic, and API endpoints. The NXMS Gateway would route incoming requests to the appropriate module based on the path, version, and HTTP method. The framework adapter (e.g., `framework-express`) would then handle the underlying server implementation, creating an Express server instance for each module and exposing the routes.

## Getting Started

### Prerequisites

- Node.js (version 18.x.x or higher)
- NX (version 18.x.x or higher)

### Forking the project

1. Fork the project locally: `git clone --depth=1 https://github.com/Joredjs/nxms.git {{your-project-name}}` the "--depth=1" flag is optional and it is for not get all the project history just the last commit
2. Go to your project directory: `cd {{your-project-name}}`
3. Initialize a new Git repository: `rm -rf .git && git init`
4. Create the fisrt commit: `git add . && git commit -m 'Initial commit forked from NXMS'` 
5. Set your project name: For thsi replacing "@nxms/" -> "@{{your-project-name}}/"
6. Install all the dependencies: `npm install`
7. Test the server local project: `nx serve server-local` this will run the default module 'example'
8. Commit the changes with the setup project: `git add . && git commit -m 'core: Setting up {{your-project-name}} project'`

### Upgrading the NX version (Optional)

This is not required, it is up to you if you want to have the last NX version. If you decide to do this, it is at your own responsibility and it could cause some errors that you should fix by yourself.

1. List the version you are using: `nx report`
2. Migrate to the latest NX version: `nx migrate latest`
3. Install all the dependencies: `npm install`
4. Run the migrations: `nx migrate --run-migrations`
5. Test the server local project: `nx serve server-local` this will run the default module 'example'
6. Commit the changes with the setup project: `git add . && git commit -m 'core: migrating nx to latest version'`

### Pushing your changes

1. Add the remote repo: `git remote add origin https://github.com/{{your-username}}/{{your-project-name}}`
2. Push the changes: `git push -u origin main`

## Working in the project

### Creating a Server

1. Generate a new application for the server: `nx g app --name server-{{your-server-name}} --directory apps/servers/{{your-server-name}}`
2. Select "none" in the list of backend frameworks
3. Retrieve the dynamically generated routes from the NXMS Gateway and generate the workaround to serve them proprerly.

### Running the Server

1. Start the server: `nx serve server-{{your-server-name}}`

### Creating a Module

1. Generate a new library for the module: `nx g lib --name module-{{yourModuleName}} --directory modules/{{yourModuleName}} --interactive`
2. **Sugested:** Choose `@nx:js` as your library collection, `jest` as your test runner and `none` as your bundler  
3. In the **project.json** file add the **lint** task as you have in your other modules.
4. Go to the module path in the src folder: `cd modules/admin/src`
5. Delete the example code created `rm -rf *`
6. Create the folders according to the [Project Structure file](./docs/structure.md): `mkdir application domain infra`
7. Create the main files according to the [Project Structure file](./docs/structure.md): `touch index.ts application/index.ts application/port.ts domain/index.ts domain/routes.ts infra/index.ts infra/controller.ts`
8. Add content to infra/controller.ts
9. Add content to application/port.ts
10. Add content to domain/routes.ts

### Add a path to your module

1. Add the path(s) in the **routes.ts** file inside the domain layer of your module. If you need an uncreated schema for your path, you need to create it in the domain layer of the core
2. Add the correspondent handler for your path to the **port.ts** file in the application layer of your module
3. Add the useCase into the useCase folder of the application layer of your module.

### Register the module to gateway

1. Add the domain group to `TDomainGroups` in `rutas.ts` inside the core (`@nxms/core`)
2. Add the module in the **modules.ts** file in the domain layer of the gateway (`@nxms/gateway`). Its important to note that you should add a version in the version attribute, if dont the routes inside the module never will be exposed
3. Add the module instance in the *api.adapter.ts* file in the infra layer of the gateway (`@nxms/gateway`)

## Documentation and Resources

- [Structure](./docs/structure.md): Detailed explanation of the project structure
- [Definitions](./docs/definitions.md): Module definitions and specifications
- [12 Factors](./docs/12factors.md): Adherence to the 12-Factor App methodology
- [Code Style](./docs/codeStyle.md): Coding conventions and style guidelines

## Contributors

- Jorge Garay [github.com/joredjs](https://github.com/joredjs)

## Contributing

Contributions to the NXMS framework are welcome! Please refer to the [CONTRIBUTING.md](./docs/CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License.
