# server-local

This NX application serves as a local development server for NXMS projects. It launches independent Node.js servers for each microservice defined within your application, enabling you to run and test your modules in isolation.

## Dependencies

- **`libs/framework/*`**: This application relies on a framework-specific library, such as `libs/framework/express`, to handle the actual server instantiation and configuration. These framework libraries, in turn, depend on the `@nxms/gateway` library to retrieve dynamically generated routes and other configurations.

## Description

The `server-local` application acts as an orchestrator for your local development environment. It performs the following key tasks:

1. **Framework Selection:** It identifies the configured backend framework (e.g., Express) based on the provided configuration or conventions.
2. **Route Retrieval:** It communicates with the NXMS Gateway (specifically, the `ApiCore` class) to retrieve the dynamically generated routes and their associated metadata.
3. **Server Instantiation:**  For each microservice defined in the gateway, `server-local` leverages the chosen framework library to create and configure an instance of a server (e.g., an Express app).
4. **Server Startup:** It starts each server instance, making the microservices accessible on their designated ports.

## Running the Application

1. **Start the server:** `nx serve server-local`

## Configuration

The server's behavior can be customized through various configuration options, typically located in the `main.ts` file within this directory. These options might include:

- **Framework Selection:** Specifying the desired backend framework to use.
- **Port Assignments:** Defining the ports on which each microservice should listen.
- **Debugging Options:** Enabling or disabling debugging features provided by the framework.

## Example

Assuming you have an Express framework configured in `libs/framework/express` and have registered your modules with the gateway, running `nx serve server-local` will:

1. Instruct the `framework-express` library to retrieve the routes from the gateway.
2. Create an Express server instance for each microservice.
3. Start each server, making your microservices accessible locally.

The console will typically display messages indicating the service name and the port it's listening on.

## Key Points

- This application is specifically designed for local development and testing.
- It relies heavily on the NXMS Gateway for route management and other configurations.
- The actual server implementation details are abstracted away by the framework-specific libraries.
