# NXMS: A Modular Monolith Framework for TypeScript Microservices

NXMS is a TypeScript framework designed for building modular monoliths within a monorepo, enabling the exposure of each module as independent microservices with unique advantages.

This document provides a comprehensive overview of the NXMS framework, its architecture, and how to get started.

## Introduction

NXMS deviates from traditional microservice architectures by leveraging the benefits of a monolith foundation. While each module functions as an independent unit with its own routes, logic rules and deployment capabilities, they all reside within a single codebase. This eliminates the need for network calls between modules, reducing potential points of failure and enhancing performance.

The framework remains agnostic to cloud providers and backend frameworks, offering flexibility and adaptability to diverse development environments.

## Key Features

- Modular Monolith Architecture: Combines the advantages of microservices (modular development, independent deployment) with the simplicity and performance of a monolith.
- Domain-Driven Design: Encourages the organization of code around business domains, promoting maintainability and scalability.
- Framework Agnostic: Compatible with various backend frameworks like Express, Fastify, Koa, and NestJS.
- Cloud Provider Agnostic: Deploy seamlessly to different cloud providers such as AWS, Google Cloud, and Azure.
- TypeScript Support: Leverages the power of TypeScript for type safety, improved code quality, and enhanced developer experience.

## Project Structure

NXMS employs a layered architecture, promoting separation of concerns and maintainability. The core layers include:

- Apps: Contains runnable projects, categorized into servers and frontends.
  - Servers: Houses server configurations for different environments (local, AWS, Firebase, etc.).
  - Fronts: Accommodates frontend applications within the monorepo (currently not extensively defined).
- Libs: Comprises reusable modules accessible across the project.
  - Framework: Manages backend framework configurations (Express, Fastify, etc.).
  - Gateway: Acts as an API gateway, handling routing, authentication, authorization, and module injection.
  - Core: Contains the core logic, interface definitions, and fundamental components.
- Modules: Represents individual domain groups, each structured with:
  - Application: Houses application logic and port definitions.
  - Domain: Contains domain entities, interfaces, and repositories.
  - Infra: Provides concrete implementations for controllers and interactions with external systems.

## Getting Started

### Prerequisites

- Node.js (version 18.x.x or higher)
- NX (version 18.x.x or higher)

### Installation

1. Install NX globally: ```npm install -g nx```
2. Create a new NX workspace: npx create-nx-workspace@latest
3. Choose a suitable preset (e.g., "empty workspace") and follow the prompts.

### Creating a Module

1. Generate a new library for the module: ```nx g lib --name my-module --directory libs/modules```
2. Structure the module according to the recommended structure outlined in the "Project Structure" section.

### Creating a Server

1. Generate a new application for the server: ```nx g app --name my-server --directory apps```
2. Configure the server to use the desired backend framework (refer to the framework's documentation for specific instructions).
3. Utilize the NXMS Gateway to expose routes from the created modules.

### Running the Application:

1. Start the server: ```nx serve my-server```

## Documentation and Resources

- Structure: Detailed explanation of the project structure
- Definitions: Module definitions and specifications
- 12 Factors: Adherence to the 12-Factor App methodology

## Contributing

Contributions to the NXMS framework are welcome! Please refer to the [CONTRIBUTING.md](./docs/CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the MIT License
