# framework-express

This library handles the configuration and setup of the Express framework within the NXMS project. It acts as an adapter between the NXMS Gateway and the Express framework, translating the dynamically generated routes and configurations from the gateway into runnable Express applications.

## Dependencies

- **`express`**: The core Express.js framework for Node.js.
- **`cors`**: Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **`@nxms/gateway`**: Provides the dynamically generated routes, authentication, authorization, and module injection functionalities through the `ApiCore` class.
- **`@nxms/core/domain`**:  Imports core domain definitions, constants, and utilities used across the NXMS project.

## Description

The `framework-express` library retrieves the route list from the NXMS Gateway using the `ApiCore` class's `getRutas` method. This list is structured into groups (representing different domains or modules) and contains information about paths, versions, HTTP methods, ports, and other metadata for each route.

The primary function, `getServices`, processes this route list and generates an object of `IExpressApps`. Each property in this object represents a configured Express application ready to be served, with the key being the application name and the value being an `IExpressMicroApp` instance. These instances are then used by a server implementation, like the `server-local` application, to start the corresponding servers. **It's important to note that this library is independent of the specific server implementation and can be used to expose routes to any configured server, whether it's a local server, AWS, Azure, Google Cloud, or any other environment.**

## Configuration

The framework-specific configurations, such as middleware setup, error handling, and other Express-related settings, are handled within this library. You can customize these configurations by providing an `IMicroServiceConfig` object to the `ExpressFramework` constructor. This object allows you to:

- Enable or disable debugging features like route logging and CORS debugging.
- Control whether to remove the module prefix from the URL.
- Specify a global JSON body size limit.

## Example

Let's say you have a module named `users` with a route defined as `/users/:id` registered with the gateway. The `framework-express` library will:

1. Obtain this route information from the gateway using the `ApiCore` class's `getRutas` method.
2. Create an `IExpressMicroApp` instance for the `users` module within the `apps` object.
3. Configure an Express router with the `/users/:id` route, including any middleware or authentication specified in the gateway configuration.
4. Return this `apps` object, which will be used by a server implementation to start an Express server serving this route.

This process, in conjunction with the NXMS Gateway, ensures that each NXMS module is exposed as an independent microservice running on its own Express server, all managed and orchestrated by the NXMS framework.
