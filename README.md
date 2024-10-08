# nxms: A Modular Monolith Framework for TypeScript Microservices

**nxms** is a TypeScript framework designed for building highly scalable and maintainable applications using a modular monolith architecture. It balances the benefits of microservices (independent development, modularity) with the simplicity and performance of a monolith, all within a single codebase.

- [nxms: A Modular Monolith Framework for TypeScript Microservices](#nxms-a-modular-monolith-framework-for-typescript-microservices)
  - [Why nxms?](#why-nxms)
  - [Core Concepts](#core-concepts)
  - [Project Structure](#project-structure)
  - [Example](#example)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Basic Setup](#basic-setup)
    - [Upgrading the NX version (Optional)](#upgrading-the-nx-version-optional)
    - [Pushing your changes](#pushing-your-changes)
  - [Working in the project](#working-in-the-project)
    - [Creating a Server](#creating-a-server)
    - [Running the Server](#running-the-server)
    - [Creating a Module](#creating-a-module)
    - [Add a path to your module](#add-a-path-to-your-module)
    - [Register the module to gateway](#register-the-module-to-gateway)
  - [Working with Modules](#working-with-modules)
  - [Documentation and Resources](#documentation-and-resources)
  - [Contributing](#contributing)
    - [Contributors](#contributors)
  - [License](#license)


## Why nxms?

- **Best of Both Worlds:** Enjoy the modularity and independent development of microservices without the complexity of distributed systems.
- **Simplified Development:**  Develop, test, and deploy modules independently while benefiting from the ease of a single codebase.
- **Enhanced Performance:** Minimize inter-service communication overhead, resulting in faster response times and improved performance.
- **Flexibility and Adaptability:**  Choose your preferred backend framework (Express, Fastify, etc.) and deploy seamlessly to various cloud providers or on-premise servers.

## Core Concepts

- **Modular Monolith:** **nxms applications** consist of independent modules, each representing a specific business domain.
- **API Gateway:** The **nxms Gateway** (`@nxms/gateway`) acts as a central entry point for all incoming requests, handling routing, authentication, authorization, and other cross-cutting concerns. It dynamically discovers and integrates modules, simplifying the addition and management of new features.
- **Framework Adapters and Agnosticism:**  **nxms** allow you to configurate any backend framework (e.g., `@nxms/framework-express` for Express), allowing you to use familiar tools while abstracting framework-specific details.
- **Server Agnosticism:**  Deploy your **nxms application** to any server environment, whether it's a local machine, a cloud provider like AWS or Azure, or a container orchestration platform like Kubernetes.
- **Domain-Driven Design**: **nxms** encourages the organization of code around business domains, promoting maintainability and scalability.

## Project Structure

**nxms** employs a layered architecture, promoting separation of concerns and maintainability. The core layers include:

- **Apps:**  Contains runnable projects (servers, potentially frontends).
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

For further details, see [Project Structure](./docs/structure.md)

## Example

Let's say you're building an e-commerce application. You could have separate modules for `users`, `products`, `orders`, and `payments`. Each module would handle its own data, logic, and API endpoints. The **nxms** Gateway would route incoming requests to the appropriate module based on the path, version, and HTTP method. The framework adapter (e.g., `framework-express`) would then handle the underlying server implementation, creating an Express server instance for each module and exposing the routes.

In this projectby default you will find an example module called `example` with some basic configuration in it, and registered on the **nxms gateway**

## Getting Started

### Prerequisites

- Node.js (version 18.x.x or higher)
- NX (version 18.x.x or higher)

### Basic Setup

1. Fork the project locally: `git clone --depth=1 https://github.com/Joredjs/nxms.git {{your-project-name}}` the "--depth=1" flag is optional and it is for not get all the project history just the last commit
2. Go to your project directory: `cd {{your-project-name}}`
3. Initialize a new Git repository: `rm -rf .git && git init`
4. Create the fisrt commit: `git add . && git commit -m 'core: initial commit forked from nxms'` 
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
3. Retrieve the dynamically generated routes from the **nxms** Gateway and generate the workaround to serve them proprerly.

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

1. Add the domain group to `TDomainGroups` in `route.ts` inside the core (`@nxms/core`)
2. Add the module in the **modules.ts** file in the domain layer of the gateway (`@nxms/gateway`). Its important to note that you should add a version in the version attribute, if dont the routes inside the module never will be exposed
3. Add the module instance in the *api.adapter.ts* file in the infra layer of the gateway (`@nxms/gateway`)

Take note that when we register the module we register three contents of the module, the controller, port and routes in the AdapterApi.    When the controller is created we set the validation to be used, when the port is created we define the IPortParams that could contains the services shared around the all project and externalUsecase which are useCases from other modules that this module could need, and for the routes creation, we take the module definition `IModule` in the modules.ts file of the domain layer of this gateway to send it to the module and obtain the route information dinamically

## Working with Modules

This section explains how to work within an **nxms module**, most of this files were created in the previos step of this document when you are creating a new module. To practice we will use the `@nxms/module-example` module located in `libs/example/src` as a reference 

**1. Understanding the Structure**

Each module follows a hexagonal architecture (as is specified in the [Project Structure file](./docs/structure.md)) with three main folders:

- **`infra`:** Contains concrete implementations for interacting with external systems (databases, APIs, etc.).
    - **`controller.ts`:**  Extends the base controller from `@nxms/core`. You usually won't need to modify this unless you need custom request handling.
    - **`xx.repository.adapter.ts`:** Implements the repository interface defined in the domain layer. and it allows connect the module with external dependencies such as databases, APIs, etc.
- **`application`:** Houses the application logic and port definitions.
    - **`port.ts`:** Defines the module's API endpoints (handlers) and orchestrates interactions between the domain and infrastructure layers. This use the `IPortParams` defined in the gateway as argument to create a IUseCaseParams which could be sended as argument to any use case
    - **`useCases` folder:** Contains the module's business logic, organized into use cases.
    - **`services` folder:** Contains the module's services, which could be used by more than one use cases.
- **`domain`:** Encapsulates the core business logic, entities, and interfaces.
    - **`routes.ts`:** Defines the module's API routes, including paths, HTTP methods, and data schemas. It implements the `IModuleRoute` interface, so it has a "getRutas" method, which must return an `IRouteGroup` interface, inside this `IRouteGroup` information, the "group","headers","puerto","versions" properties come from the module definitio as well the "schema" propertie inside every path
    - **`interface.ts` (optional):** Defines interfaces for domain entities.
    - **`repository.ts` (optional):** Defines the interface for the module's repository located in the infra layer (if applicable).

**2. Example Module (`@nxms/module-example`)**

Let's look at the `example` module to see these concepts in action:

- **`infra/controller.ts`:**  Implements the `example` module's API endpoints, handling incoming requests and returning responses.
- **`application/port.ts`:**  Defines the `example` module's API routes and their corresponding handlers.
- **`domain/routes.ts`:**  Specifies the paths, HTTP methods, and data schemas for the `example` module's API endpoints.

**3. Key Concepts**

- **Handlers:** Functions in `port.ts` that handle incoming requests for specific API routes. They receive request data defined in  `ITransactionParams`, interact with use cases sending a `IUseCaseParams` as argument, and return responses in the `Promise<IOKResponse<string> | IErrResponse> ` structure which is interpreted by the controller. Every handler have an specifyc structure, it adds the path method and "_" to the begginig of the path, also it takes the path replace the slashes "/" for "_" and the colon ":" for "\$", e.g: For the path "users/list/:id" accesed by get the handler function in the port should be "get_users_list_$id()" and for the path "users/update/:id/name" accesed by put the handler function in the port should be "put_users_update_$id_name()".
- **Use Cases:** Implement the module's business logic. They are called by handlers and operate on domain entities. It recieve a `IUseCaseParams` parameter that allows to consume global project services, external use cases or use the module's repository
- **Repositories (Optional):**  Provide an abstraction layer for interacting with data sources (databases, APIs).

**4. Adding Functionality**

To add new functionality to a module:

1. **Define the API Route:** Add the route definition to `domain/routes.ts`.
2. **Create the Handler:** Implement the handler function in `application/port.ts`.
3. **Implement the Use Case:** Create a new use case in the `application/useCases` folder to handle the business logic.
4. **Interact with External Systems (if needed):** Use a repository (if applicable) or create an adapter in the `infra` layer to interact with external systems. 

## Documentation and Resources

- [Structure](./docs/structure.md): Detailed explanation of the project structure
- [Code Style](./docs/codeStyle.md): Coding conventions and style guidelines
- [Definitions](./docs/definitions.md): Module definitions and specifications
- [12 Factors](./docs/12factors.md): Adherence to the 12-Factor App methodology

## Contributing

Contributions to the **nxms** framework are welcome! Please refer to the [CONTRIBUTING.md](./docs/CONTRIBUTING.md) file for guidelines.

### Contributors

- Jorge Garay [github.com/joredjs](https://github.com/joredjs)

## License

This project is licensed under the MIT License.
