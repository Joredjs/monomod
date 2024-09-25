# core

This library represents the heart of the NXMS project, housing core functionalities, interfaces, and utilities that are shared and depended upon by every other library and application within the project. It acts as the foundational layer, ensuring consistency and providing common building blocks for the entire NXMS ecosystem.

## Description

The `core` library is structured into three main sections, each addressing a specific aspect of the framework's core functionality:

- **`infra`:** This section provides the groundwork for handling incoming requests. It includes the base controller, which serves as a template for all controllers across the application, ensuring a standardized approach to request handling.
- **`application`:** This section houses shared services that encapsulate common business logic. These services are defined in an abstract manner, decoupled from their concrete implementations, promoting flexibility and testability.
- **`domain`:** This section defines the fundamental building blocks of the NXMS domain model. It includes essential interfaces that establish contracts for data structures, entities, and interactions within the application. Additionally, it houses project-wide constants and enums, ensuring consistency and clarity across the codebase.

## Key Features

- **Centralized Core Logic:** Provides a single source of truth for shared functionalities, reducing code duplication and ensuring consistency.
- **Abstract Service Definitions:** Defines services in an implementation-agnostic manner, allowing for flexibility in choosing specific implementations based on project needs.
- **Standardized Request Handling:** Offers a base controller that enforces a consistent approach to handling incoming requests, promoting maintainability and reducing boilerplate code.
- **Domain Model Foundation:**  Establishes the core interfaces and data structures that form the foundation of the NXMS domain model, ensuring a cohesive and well-defined application structure.

## Dependencies

This library has no external dependencies, making it a truly independent and fundamental part of the NXMS framework.

## Usage

The `core` library is implicitly used by all other libraries and applications within the NXMS project. Its components are imported and utilized throughout the codebase to ensure consistency, leverage shared functionalities, and adhere to the established architectural patterns.
