# Development guide

## Working in the project

### Creating a Server

1. Generate a new application for the server: `nx g app --name server-{{your-server-name}} --directory apps/servers/{{your-server-name}}`
2. Select "none" in the list of backend frameworks
3. Retrieve the dynamically generated routes from the **monomod** Gateway and generate the workaround to serve them proprerly.

### Running the Server

1. Start the server: `nx serve server-{{your-server-name}}`

### Creating a Module

1. Generate a new library for the module: `nx g lib --name module-{{yourModuleName}} --directory modules/{{yourModuleName}} --interactive`
2. **Sugested:** Choose `@nx:js` as your library collection, `jest` as your test runner and `none` as your bundler  
3. In the **project.json** file add the **lint** and the **test** tasks as you have in your other modules.
4. Go to the module path in the src folder: `cd modules/{{yourModuleName}}/src`
5. Delete the example code created `rm -rf *`
6. Create the folders according to the [Project Structure file](./docs/structure.md): `mkdir application domain infra`
7. Create the main files according to the [Project Structure file](./docs/structure.md): `touch index.ts application/index.ts application/port.ts domain/index.ts domain/routes.ts infra/index.ts infra/controller.ts`
8. Add content to infra/controller.ts
9. Add content to application/port.ts
10. Add content to domain/routes.ts

### Add a path to your module

1. Add the path(s) in the **routes.ts** file inside the domain layer of your module. If you need an uncreated schema for your path, you need to create it in the domain layer of the **monomod core**
2. Add the correspondent handler for your path to the **port.ts** file in the application layer of your module
3. Add the useCase into the "useCase" folder in the application layer of your module.

### Register the module to gateway

1. Add the domain group to `TDomainGroups` in `route.ts` inside the core (`@monomod/core`) ( the order here doesn't matters)
2. Add the module in the `modulos` object in the **modules.ts** file in the domain layer of the gateway (`@monomod/gateway`). Its important to note that you should add a version in the version attribute, if dont the routes inside the module never will be exposed
3. Add the module in the `modulesList` list in  the **modules.ts** file in the domain layer of the gateway (`@monomod/gateway`). The order here is very important mainly for the use of the externalUseCases, if a module expose an externalUseCase, the owner must be before that the module who use that externalUseCase.
4. Add the module instance in the *api.adapter.ts* file in the infra layer of the gateway (`@monomod/gateway`)

Take note that when we register the module we register three contents of the module, the controller, port and routes in the AdapterApi. When the controller is created we set the validation to be used, when the port is created we define the IPortParams that could contains the services shared around the all project and externalUsecase which are useCases from other modules that this module could need, and for the routes creation, we take the module definition `IModule` in the modules.ts file of the domain layer of this gateway to send it to the module and obtain the route information dinamically

## Working with Modules

This section explains how to work within an **monomod module**, most of this files were created in the previos step of this document when you are creating a new module. To practice we will use the `@monomod/module-example` module located in `libs/example/src` as a reference

### Understanding the Structure

Each module follows a hexagonal architecture (as is specified in the [Project Structure file](./docs/structure.md)) with three main folders:

- **`infra`:** Contains concrete implementations for interacting with external systems (databases, APIs, etc.).
  - **`controller.ts`:**  Extends the base controller from `@monomod/core`. You usually won't need to modify this unless you need custom request handling.
  - **`xx.repository.adapter.ts`:** Implements the repository interface defined in the domain layer. and it allows connect the module with external dependencies such as databases, APIs, etc.
- **`application`:** Houses the application logic and port definitions.
  - **`port.ts`:** Defines the module's API endpoints (handlers) and orchestrates interactions between the domain and infrastructure layers. This use the `IPortParams` defined in the gateway as argument to create a IUseCaseParams which could be sended as argument to any use case
  - **`useCases` folder:** Contains the module's business logic, organized into use cases.
  - **`services` folder:** Contains the module's services, which could be used by more than one use cases.
- **`domain`:** Encapsulates the core business logic, entities, and interfaces.
  - **`routes.ts`:** Defines the module's API routes, including paths, HTTP methods, and data schemas. It implements the `IModuleRoute` interface, so it has a "getRutas" method, which must return an `IRouteGroup` interface, inside this `IRouteGroup` information, the "group","headers","puerto","versions" properties come from the module definitio as well the "schema" propertie inside every path
  - **`interface.ts` (optional):** Defines interfaces for domain entities.
  - **`repository.ts` (optional):** Defines the interface for the module's repository located in the infra layer (if applicable).

### Example Module (`@monomod/module-example`)

Let's look at the `example` module to see these concepts in action:

- **`infra/controller.ts`:**  Implements the `example` module's API endpoints, handling incoming requests and returning responses.
- **`application/port.ts`:**  Defines the `example` module's API routes and their corresponding handlers.
- **`domain/routes.ts`:**  Specifies the paths, HTTP methods, and data schemas for the `example` module's API endpoints.

### Key Concepts

- **Handlers:** Functions in `port.ts` that handle incoming requests for specific API routes. They receive request data defined in  `ITransactionParams`, interact with use cases sending a `IUseCaseParams` as argument, and return responses in the `Promise<IOKResponse<string> | IErrResponse>` structure which is interpreted by the controller. Every handler have an specifyc structure, it adds the path method and "*" to the begginig of the path, also it takes the path replace the slashes "/" for "*" and the colon ":" for "\$", e.g: For the path "users/list/:id" accesed by get the handler function in the port should be "get_users_list_$id()" and for the path "users/update/:id/name" accesed by put the handler function in the port should be "put_users_update_$id_name()".
- **Use Cases:** Implement the module's business logic. They are called by handlers and operate on domain entities. It recieve a `IUseCaseParams` parameter that allows to consume global project services, external use cases or use the module's repository
- **Repositories (Optional):**  Provide an abstraction layer for interacting with data sources (databases, APIs).

### Adding Functionality

To add new functionality to a module:

1. **Define the API Route:** Add the route definition to `domain/routes.ts`.
2. **Create the Handler:** Implement the handler function in `application/port.ts`.
3. **Implement the Use Case:** Create a new use case in the `application/useCases` folder to handle the business logic.
4. **Interact with External Systems (if needed):** Use a repository (if applicable) or create an adapter in the `infra` layer to interact with external systems.
ate @monomod/module my-module
