# @nxms/framework-express: Express.js Adapter for nxms

This module seamlessly integrates **the nxms framework** with Express.js, enabling you to build modular monolith applications using the familiar Express.js API. It acts as an adapter, translating dynamically generated routes and configurations from the **nxms Gateway** into runnable Express applications.

## Key Features

- **Easy Integration:** Quickly set up nxms modules within your Express.js application.
- **Dynamic Route Mapping:** Automatically maps routes retrieved from the **nxms gateway** to Express.js endpoints.
- **Middleware Support:**  Leverages Express.js middleware for cross-cutting concerns.
- **Centralized Error Handling:** Provides a unified approach to handling errors within your Express.js applications.
- **Simplified CORS Configuration:**  Easily configure CORS for your API endpoints based on nxms Gateway settings.

## Dependencies

- **`express`**: The core Express.js framework for Node.js.
- **`cors`**: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **`@nxms/gateway`**: Provides the dynamically generated routes, authentication, authorization, and module injection functionalities through the `ApiCore` class.
- **`@nxms/core/domain`**:  Imports core domain definitions, constants, and utilities used across the NXMS project.

## How It Works

The `framework-express` library retrieves the route list from the **nxms Gateway** using the `ApiCore` class's `getMicroServices` method. This list is structured into groups (representing different domains or modules) and contains information about paths, versions, HTTP methods, ports, and other metadata for each route.

The primary function, `getServices`, processes this route list and generates an object of `IExpressApps`. Each element in this object represents a configured Express application ready to be served, with the key being the application name and the value being an `IExpressMicroApp` instance. These instances are then used by a server implementation, like the `server-local` application, to start the corresponding servers. **It's important to note that this library is independent of the specific server implementation and can be used to expose routes to any configured server, whether it's a local server, AWS, Azure, Google Cloud, or any other environment.**

Sumarizing this is how this module works:

1. **Route Retrieval**: The @nxms/framework-express module fetches the dynamically generated routes from the nxms Gateway using the ApiCore class.
2. **Express Application Creation**: For each registered nxms module, an IExpressMicroApp instance is created, representing a configurable Express application.
3. **Route Mapping and Middleware**: Routes from the nxms Gateway are mapped to Express.js endpoints, and middleware specified in the gateway configuration is applied.
4. **Server Startup**: The getServices method returns an object containing configured Express applications, ready to be started by your server implementation (e.g., server-local).



## Configuration

The framework-specific configurations, such as middleware setup, error handling, and other Express-related settings, are handled within this library. You can customize these configurations by providing an `IMicroServiceConfig` object to the `ExpressFramework` constructor. This object contains  the following options:

```typescript
const appConfig = {
    addGroupName: true,    // Prefix routes with the module group name (default: true)
    bodyLimit: '5mb',      // Maximum request body size (default: '5mb')
    debug: {
        cors: false,     // Log CORS information (default: false)
        paths: false,    // Log route path information (default: false)
        routes: false,   // Log all registered routes (default: false)
    },
};
```

## Usage

**Example:**

```typescript
import { ExpressFramework } from '@nxms/framework-express';

const appConfig = { 
    // ... your nxms and Express configuration ...
};

const framework = new ExpressFramework(appConfig);

const microServices = framework.getServices();

// Go through microServices list and ensure to serve each one indepedently 
```

## Example

Let's say you have a module named `users` with a route defined as `/users/:id` registered with the gateway. The `framework-express` library will:

1. Obtain this route information from the gateway using the `ApiCore` class's `getServices` method.
2. Create an `IExpressMicroApp` instance for the `users` module within the `apps` object.
3. Configure an Express router with the `/users/:id` route, including any middleware or authentication specified in the gateway configuration.
4. Return this `apps` object, which will be used by a server implementation to start an Express server serving this route.

This process, in conjunction with the **nxms Gateway**, ensures that each **nxms module** is exposed as an independent microservice running on its own Express server, all managed and orchestrated by the **nxms framework**.

By default this project comes with a module "example" already registered in the **nxms gateway**
