# framework-express

## dependecies

- __express__: nodejs framework
- __cors__: nodejs utility
- __libs/core/gateway__: Exports the routes list
- __libs/core/main__: xx

## description

The route list obtained from the __gateway__ is a list of groups (domain) and it has paths and versions (among others) per each one. The main function `getServices` exports an express-app per every route group, every express app has a list of http methods and paths per every version and path inside the route group.
