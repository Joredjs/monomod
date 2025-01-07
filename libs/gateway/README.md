# @monomod/gateway: The monomod API Gateway

The `@monomod/gateway` module serves as the central API gateway for the **monomod** project, responsible for managing routes, handling authentication, authorization, module injection, and providing a unified interface for accessing the various modules within your application.

This module is designed to be framework-agnostic. You can integrate it with your preferred backend framework using the gateway adapter from the selected framework  for instance the  `@monomod/framework-express` module to  integrate this gateway with an Express.js application.

## Description

The `gateway` library acts as the entry point for all incoming requests to your monomod application. It performs several crucial functions:

- **Module Initialization:**  Loading and initializing individual **monomod** modules.
- **Service Discovery:** Maintains a registry of available modules (or microservices) within your application, along with their respective ports and other relevant metadata. This allows for dynamic routing and service discovery.
- **Dynamic Routing:**  Processes incoming requests and routes them to the appropriate module based on the request path, version, and other criteria. It dynamically generates routes based on the configurations provided by each module, ensuring a flexible and scalable routing mechanism.
- **Parameter Validation:**  Validates incoming request parameters, headers, and body content against predefined schemas and rules. This ensures data integrity and security by preventing invalid or malicious requests from reaching your modules.
- **Authentication:**  Handles user authentication to verify the identity of clients accessing your API. It integratethe token authentication mechanism to provide secure access control.
- **Authorization:**  Enforces access control policies to determine which users or roles have permission to access specific routes or resources. This ensures that sensitive data and functionalities are protected from unauthorized access.
- **Error Handling:** Provides a centralized mechanism for handling errors and exceptions that occur within the gateway or any of the modules. It ensures consistent error responses are sent back to the client, facilitating debugging and error tracking.
- **Cross-Cutting Concerns:** Handling cross-cutting concerns like logging, error handling, and request validation.

## Key Components

- **`ApiCore`:** The core class responsible for managing the gateway's functionality. It exposes a method to obtain the registered modules, the defined routes and the correspondetly handlers for every path request.
- **`AdapterApi`:** This class acts as the bridge between the **monomod modules** and your chosen backend framework (e.g., Express). It:
  - Retrieves route definitions from modules.
  - Initializes services required by the application.
  - Creates instances of controllers and ports for each module.
  - Maps routes and exposes methods for their corresponding handlers.
- **`PortControllers`, `PortPorts`, `PortRoutes`:** These classes work together to manage the instantiation and configuration of controllers, ports, and routes from different modules.
- **`AppValidation`:**  Handles the validation of incoming requests, including headers, parameters, and body content. It leverages validation schemas and rules to ensure data integrity.
- **`ServiceHeaders`:**  Manages header-based authentication and authorization. It validates tokens, checks session times, and enforces route-level access control based on user roles.
- **`ServiceLayers`:** This class provides a way to access the controllers and ports of different modules.

## Configuration

The gateway's behavior can be customized through various configuration options. These options allow you to:

- Define global headers that should be included in all responses.
- Configure authentication and authorization mechanisms.
- Set up middleware for request logging, error handling, and other functionalities.
- Specify validation schemas for request parameters and body content.

## Service configuration

There are some utilities which could be used for one or more modules  (e.g., database connections, external API clients, cryptography, notifications, etc), these are knowed as global project services.

These services ar created in the **monomod core** (`@monomod/core`) and are registered in the `AdapterApi` class. Take note that the services are created without know the external dependencies, so the dependencie import is made by the infra layer of this apigateway (`@monomod/gateway`)

## Module definition

The defination of every module should be in the `modules.ts` based in the `IModule` interface, The "puertos" variable is the port which the project will be serve when it used locally, normally by the `@monomod/server-local` server. The name must exist in the `TDomainGroups` type in `route.ts` file inside the **monomod core** (`@monomod/core`).

Its important to note that you should add a valid version in the version attribute, if dont the routes inside the module never will be exposed.

By default the project has confugired a module "example".

## Module Registration

For adding a new module you need to add it to the `TDomainGroups` type.

1. Add the module definition in the `modules.ts` file in the domain layer.
2. Add the module instance in the `api.adapter.ts` file

Take note that when we register the module we register three contents of the module, the controller, port and routes in the `AdapterApi`. When the controller is created we set the validation to be used, when the port is created we define the `IPortParams` interface that could contains the global project services sand externalUsecase which are use cases from other modules that this module could need, and for the routes creation,file to send it to the module and obtain the route information dinamically

## Using the Gateway

The `ApiCore` class is the main entry point for interacting with the gateway. It provides a method called `getMicroServices` that returns an array of `IRouteGroup` objects. Each `IRouteGroup` represents a domain group with route information belonging to a specific module and contains information about the module's name, port, and the routes themselves.

This `getMicroServices` method is typically used by the framework libraries, such as `framework-express`, to retrieve the dynamically generated routes from the gateway and configure the framework accordingly. Although the default framework is Express, it can be adapted to work with any backend TypeScript framework. Subsequently, the framework exposes these routes to the server, which can be any server environment, whether local or cloud-based.

**Example:**

```typescript
// Example of registering a module and starting the server (using Express)
const frameworkService:IFrameworkService = new YourFrameworkService();
const apiCore = new ApiCore<IYourFrameworkParams, TYourFrameworkReq, TYourFrameworkRes>(
  frameworkService
);

const microServices: IRouteGroup<IExpressParams>[] = apiCore.getMicroServices();

// Go through microServices list and ensure to serve each ine indepedently 
```
