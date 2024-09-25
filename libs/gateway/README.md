# gateway

This library serves as the central API gateway for the NXMS project, responsible for managing routes, handling authentication, authorization, module injection, and providing a unified interface for accessing the various modules within your application.

## Description

The `gateway` library acts as the entry point for all incoming requests to your NXMS application. It performs several crucial functions:

- **Service Discovery:** Maintains a registry of available modules (or microservices) within your application, along with their respective ports and other relevant metadata. This allows for dynamic routing and service discovery.
- **Dynamic Routing:**  Processes incoming requests and routes them to the appropriate module based on the request path, version, and other criteria. It dynamically generates routes based on the configurations provided by each module, ensuring a flexible and scalable routing mechanism.
- **Parameter Validation:**  Validates incoming request parameters, headers, and body content against predefined schemas and rules. This ensures data integrity and security by preventing invalid or malicious requests from reaching your modules.
- **Authentication:**  Handles user authentication to verify the identity of clients accessing your API. It integratethe token authentication mechanism to provide secure access control.
- **Authorization:**  Enforces authorization rules to determine which users or roles have permission to access specific routes or resources. This ensures that sensitive data and functionalities are protected from unauthorized access.
- **Error Handling:** Provides a centralized mechanism for handling errors and exceptions that occur within the gateway or any of the modules. It ensures consistent error responses are sent back to the client, facilitating debugging and error tracking.

## Key Components

- **`ApiCore`:** The core class responsible for managing the gateway's functionality. It exposes methods for registering modules, defining routes, configuring middleware, and handling requests.
- **`AppValidation`:**  Handles the validation of incoming requests, including headers, parameters, and body content. It leverages validation schemas and rules to ensure data integrity.
- **`ServiceHeaders`:**  Manages header-based authentication and authorization. It validates tokens, checks session times, and enforces route-level access control based on user roles.

## Configuration

The gateway's behavior can be customized through various configuration options. These options allow you to:

- Define global headers that should be included in all responses.
- Configure authentication and authorization mechanisms.
- Set up middleware for request logging, error handling, and other functionalities.
- Specify validation schemas for request parameters and body content.

## Using the Gateway

The `ApiCore` class is the main entry point for interacting with the gateway. It provides a method called `getRutas` that returns an array of `IRouteGroup` objects. Each `IRouteGroup` represents a group of routes belonging to a specific module and contains information about the module's name, port, and the routes themselves.

This `getRutas` method is typically used by the framework libraries, such as `framework-express`, to retrieve the dynamically generated routes from the gateway and configure the framework accordingly. Although the default framework is Express, it can be adapted to work with any backend TypeScript framework. Subsequently, the framework exposes these routes to the server, which can be any server environment, whether local or cloud-based.

<!--## Integration with Modules-->
