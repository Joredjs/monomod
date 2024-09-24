# 12 Factors in NXMS

This document outlines how the NXMS project strives to adhere to the principles of the 12-Factor App methodology, a set of best practices for building modern, scalable, and maintainable web applications.

## I. Codebase

### One codebase tracked in revision control, many deploys 

NXMS utilizes a monorepo structure managed with NX, enabling a single codebase for all modules and applications. This ensures consistency across deployments and simplifies version control.

### Branching Strategy 

The project adopts a trunk-based development approach, with the main branch serving as the primary integration point. Feature branches are merged into main, and releases are made from there.

## II. Dependencies

### Explicitly declare and isolate dependencies

NXMS leverages the package management capabilities of NPM. Each module and application within the monorepo explicitly declares its dependencies in its respective package.json file. This ensures consistent dependency resolution across environments and avoids conflicts.

## III. Config

### Store config in the environment

Configuration values, such as database credentials, API keys, and environment-specific settings, are stored as environment variables. This separation of configuration from code promotes portability and simplifies deployment to different environments.

## IV. Backing Services

### Treat backing services as attached resources

NXMS promotes the concept of treating external services, such as databases, message queues, and APIs, as attached resources. This means that the application should be able to connect to different instances of these services without code changes, typically achieved through configuration.

## V. Build, Release, Run

### Strictly separate build and run stages

NXMS encourages the use of CI/CD pipelines to automate the build, release, and run stages. This ensures consistent and repeatable deployments.

## VI. Processes

### Execute the app as one or more stateless processes

NXMS applications are designed to be stateless, meaning that they do not store any data in memory or on disk that is required for subsequent requests. This allows for horizontal scalability and resilience.

## VII. Port Binding

### Export services via port binding

NXMS applications expose their services on specific ports, making them accessible to other processes or services. This promotes modularity and allows for independent deployment and scaling.

## VIII. Concurrency

### Scale out via the process model

NXMS applications are designed to be horizontally scalable, meaning that they can handle increased load by adding more instances of the application processes. This is facilitated by the stateless nature of the applications.

## IX. Disposability

### Maximize robustness with fast startup and graceful shutdown

NXMS applications strive for fast startup times and graceful shutdown procedures. This ensures that applications can be quickly deployed and scaled, and that they can handle unexpected terminations without data loss or corruption.

## X. Dev/Prod Parity

### Keep development, staging, and production as similar as possible

NXMS encourages the use of consistent environments across development, staging, and production. This minimizes the risk of environment-specific issues and promotes predictability.

## XI. Logs

### Treat logs as event streams

NXMS applications treat logs as event streams, meaning that they are written to a centralized logging system rather than to local files. This allows for easier monitoring, analysis, and troubleshooting.

## XII. Admin Processes

### Run admin/management tasks as one-off processes

Administrative tasks, such as database migrations or cache clearing, are treated as one-off processes that are run independently of the main application processes. This ensures that these tasks do not interfere with the normal operation of the application.
