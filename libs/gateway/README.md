# gateway

This library was generated with [Nx](https://nx.dev).

## description

Before go to any module, this library makes the validations like security, parameters and schema. As weel as include the services dependecies. Also here are defined the global headers and the app modules

- Service discovery: With the modules list (setting the name and the port)
- Dynamic Routing: With the routes list (setting the paths and parameters) per each module
- Parameter valdiation within AppValidations:
  - validate the mandatory Headers with DataHeaders,
  - validate the locals (routeinfo) setted in the framework initialization
  - validate the params with the schemaService and the own scheme per route
- Authetication: Into the ServiceHeader it validates the token ant the session time
- Authorization: Into the ServiceHeader it validates the route privacy with the token role
- Error Handling:
