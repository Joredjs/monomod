# @nxms/server-local: The nxms local server

This server is responsible for launching and managing local development servers for nxms microapps. It dynamically retrieves routes from the **nxms gateway** (`@nxms/gateway`), creates server instances for each microapp, and starts them on designated HTTP ports, enabling you to run and test your modules in isolation.



## Overview

The `server-local` application acts as an orchestrator for your local development environment. It performs the following key tasks:

1. **Framework Selection:** It identifies the configured backend framework (e.g., Express) based on the provided configuration or conventions.
2. **Route Retrieval:** Through the framework, it communicates with the **nxms gateway** (specifically, the `ApiCore` class) to retrieve the dynamically generated routes and their associated metadata.
3. **Server Instantiation:** For each microapp defined in the gateway, `server-local` leverages the chosen framework library to create and configure an instance of a server (e.g., an Express app).
4. **Server Startup:** It starts each server instance, making the microservices accessible on their designated ports.

## Dependencies

- **`libs/framework/*`**: This application relies on a framework-specific library, such as `libs/framework/express`, to handle the actual server instantiation and configuration. These framework libraries, in turn, depend on the `@nxms/gateway` library to retrieve dynamically generated microapp's routes and other configurations.

## Running the Application

1. **Start the server:** `nx serve server-local`

## Configuration

The server's behavior can be customized through various configuration options, typically located in the `config.ts` file within this directory. These options might include:

- `bodyLimit`: The maximum allowed size for request bodies (e.g., '5mb').
- `debug`: Enables debugging features like CORS, path logging, and route logging.
- `addDomainName`: Whether to add a domain name to the server's URL.

## Example

Assuming you have an Express framework configured in `libs/framework/express` and have registered your modules with the gateway. Running `nx serve server-local` will:

1. Instruct the `framework-express` library to retrieve the routes from the gateway.
2. Create an Express server instance for each microapp.
3. Start each server, making your microapps accessible locally.

The console will typically display messages indicating the service name and the port it's listening on.

## Key Points

- This application is specifically designed for local development and testing.
- It relies heavily on the **nxms gateway** for route management and other configurations.
- The actual server implementation details are abstracted away by the framework-specific libraries.

## Code Walkthrough (src/main.ts)

The `src/main.ts` file is the heart of the `server-local` application. Here's a breakdown of its key components:

1. **Import Dependencies:**
   - `Config` from `config.ts`: Contains the application's configuration settings.
   - `ApiCore` from `@nxms/gateway`: Used to interact with the gateway and retrieve microapp routes.
   - `Framework` from `libs/framework/*`: The framework-specific library for server instantiation and configuration.

2. **Initialize Framework:**
   - The `Framework` class is instantiated, providing the necessary framework-specific functionality and the application's configuration.

3. **Retrieve Routes:**
   - The `ApiCore` class is used to fetch the microapps information from the gateway.

4. **Create Servers:**
   - For each microapp retrieved from the gateway, the `Framework` class is used to create a server instance.

5. **Start Servers:**
   - Each server instance is started, making the microapps accessible on their designated ports.

6. **Logging:**
   - The application logs information about the started servers, including their names and ports.

## Conclusion

The `server-local` application provides a streamlined and efficient way to manage local development servers for nxms microapps. Its dynamic route retrieval, framework abstraction, and easy configuration make it a valuable tool for developers working on nxms project.
