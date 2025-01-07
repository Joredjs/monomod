# 12 Factors in monomod

This document details how monomod strives to adhere to the [12-Factor App methodology](https://12factor.net/), ensuring scalable, maintainable, and cloud-native applications.

## I. Codebase

One codebase tracked in revision control, many deploys, monomod uses a monorepo structure managed with NX, enabling:

- Single source of truth for all modules
- Consistent versioning across components
- Clear dependency management

```markdown
monomod/
├── apps/                  # Deployable applications
├── libs/                  # Shared libraries
└── modules/              # Business modules
```

### Branching and Deployment Strategy

monomod adopts a trunk-based development approach, with the main branch serving as the primary integration point. Feature branches are merged into main, and releases are made from there.

- Main branch serves as the source of truth
- Each environment (dev, staging, prod) deploys from the same codebase
- Feature branches merge to main via Pull Requests

## II. Dependencies

Explicitly declare and isolate dependencies,monomod manages dependencies through:

- Package.json for each module
- NX workspace management
- Explicit dependency declaration in module interfaces

```json
{
  "dependencies": {
    "@monomod/core": "workspace:*",
    "@monomod/gateway": "workspace:*"
  }
}
```

### Dependency Management

- Workspace-level dependencies in root package.json
- Module-specific dependencies in respective package.json
- Automated dependency tracking through NX

## III. Config

Store config in the environment. Configuration management in monomod:

- Environment variables for sensitive data
- Configuration service in the gateway
- Module-specific config through dependency injection

```typescript
// Example of config access in a module
//TODO: validate this implementation
export class ExampleService {
  constructor(
    @Inject('CONFIG') private config: IConfig
  ) {}
}
```

### Configuration Hierarchy

1. Environment variables
2. Gateway configuration
3. Module-specific configuration

## IV. Backing Services

Treat backing services as attached resources, monomod promotes the concept of treating external services, such as databases, message queues, and APIs, as attached resources. This means that the application should be able to connect to different instances of these services without code changes, typically achieved through configuration.

monomod's hexagonal architecture enables:

- Service abstraction through interfaces
- Easy switching between implementations
- Clean separation of concerns

```typescript
// Example of a backing service interface
export interface IStorageService {
  store(data: any): Promise<void>;
  retrieve(id: string): Promise<any>;
}

// Implementation can be swapped without changing business logic
//TODO: validate this implementation
@Injectable()
export class S3StorageService implements IStorageService {
  // Implementation details
}
```

## V. Build, Release, Run

Strictly separate build and run stages, monomod encourages the use of CI/CD pipelines to automate the build, release, and run stages. This ensures consistent and repeatable deployments.

monomod's build process:

1. **Build**: `nx build` compiles TypeScript and bundles assets
2. **Release**: Version tagging and artifact creation
3. **Run**: Server deployment with environment-specific config

```bash
# Build stage
nx build server-local

# Release stage
docker build -t monomod-app .

# Run stage
docker run -e NODE_ENV=production monomod-app
```

## VI. Processes

Execute the app as one or more stateless processes

monomod applications are designed to be stateless, meaning that they do not store any data in memory or on disk that is required for subsequent requests. This allows for horizontal scalability and resilience.

**Implementation:**

- Stateless module design
- Session management through external services
- Cache abstraction for shared state

```typescript
// Example of stateless request handling
//TODO: validate this implementation
@Controller()
export class ExampleController {
  async handleRequest(req: IRequest): Promise<IResponse> {
    // State managed through external services
    const session = await this.sessionService.get(req.sessionId);
    // Process request
    return response;
  }
}
```

## VII. Port Binding

Export services via port binding, monomod applications expose their services on specific ports, making them accessible to other processes or services. This promotes modularity and allows for independent deployment and scaling.

monomod's server configuration:

- Dynamic port assignment through environment variables
- Independent module servers
- Gateway-managed routing

```typescript
// server-local configuration
export const serverConfig = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost'
};
```

## VIII. Concurrency

Scale out via the process model, monomod applications are designed to be horizontally scalable, meaning that they can handle increased load by adding more instances of the application processes. This is facilitated by the stateless nature of the applications.

**Implementation:**

- Horizontal scaling through module independence
- Load balancing support
- Stateless design enabling multiple instances

## IX. Disposability

Maximize robustness with fast startup and graceful shutdown,monomod applications strive for fast startup times and graceful shutdown procedures. This ensures that applications can be quickly deployed and scaled, and that they can handle unexpected terminations without data loss or corruption.

**Implementation:**

- Quick startup through efficient dependency injection
- Graceful shutdown handling
- Connection pool management

```typescript
// Example of graceful shutdown
//TODO: validate this implementation
process.on('SIGTERM', async () => {
  await gateway.shutdown();
  await db.disconnect();
  process.exit(0);
});
```

## X. Dev/Prod Parity

Keep development, staging, and production as similar as possible,monomod encourages the use of consistent environments across development, staging, and production. This minimizes the risk of environment-specific issues and promotes predictability.

**Implementation:**

- Docker containers for consistent environments
- Environment-specific configuration through variables
- Identical deployment processes across environments

## XI. Logs

Treat logs as event streams, monomod applications treat logs as event streams, meaning that they are written to a centralized logging system rather than to local files. This allows for easier monitoring, analysis, and troubleshooting.

**Implementation:**

- Centralized logging service
- Structured log format
- Async logging implementation

```typescript
// Example of structured logging
//TODO: validate this implementation
logger.info('Request processed', {
  moduleId: 'example',
  requestId: req.id,
  duration: process.hrtime(start)
});
```

## XII. Admin Processes

Run admin/management tasks as one-off processes, administrative tasks, such as database migrations or cache clearing, are treated as one-off processes that are run independently of the main application processes. This ensures that these tasks do not interfere with the normal operation of the application.

**Implementation:**

- CLI commands for administrative tasks
- Separate admin module for management functions
- Task scheduling through external service

```typescript
// Example admin task
export class DatabaseMigration {
  async execute() {
    // Migration logic
  }
}
```

## Monitoring and Compliance

monomod provides tools to monitor adherence to these principles:

- Dependency analysis through NX
- Configuration validation
- Health check endpoints
- Performance monitoring

## Related Documentation

- [Architecture Guide](./architecture.md)
- [Deployment Guide](./deployment.md)
- [Configuration Guide](./configuration.md)
