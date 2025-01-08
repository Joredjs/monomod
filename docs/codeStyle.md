# monomod Code Style Guide

This guide outlines the coding conventions and style guidelines for the monomod project. Adhering to these standards ensures code consistency, readability, and maintainability.

## General Principles

- Readability First: Prioritize code clarity and understandability. Write code for humans, not just machines.
- Consistency: Maintain a consistent coding style throughout the project. Follow the established patterns and conventions.
- Simplicity: Strive for simplicity in code structure and logic. Avoid unnecessary complexity.
- Self-Documenting Code: Use meaningful variable and function names. Write code that is self-explanatory.

## Specific Guidelines

You can refeer to the [editor config](../.editorconfig), the [eslint](../.eslintrc.json) and the [prettier](../.prettierrc) files to see the main code guidelines

## TypeScript Best Practices

### Type Definitions

- Use explicit type annotations for function parameters and return types
- The interfaces must begin with the "I" capital letter followed by the name of the interface in PascalCase, e.g. IUserService.
- The types must begin with the "T" capital letter followed by the name of the type in PascalCase, e.g. TUser.
- Prefer interfaces (`I` prefix) over type aliases (`T` prefix) for object definitions
- Use generics for reusable components and utilities

```typescript
interface IUserService {
getUser<T extends IBaseUser>(id: string): Promise<T>;
}
```

### Exports and Imports

- Use barrel exports (index.ts) for module public APIs
- Group imports by type (external, internal, relative)
- Avoid default exports

```typescript
/ Good
export from './services';
export from './models';
// Bad
export default class UserService {}
}
```

### Error Handling

- Use the Result pattern for error handling
- Always normalize errors through core utilities

```typescript
// Good
typescript
try {
// Operation
} catch (error) {
throw normalizeError(error);
}
```

### File Organization

- One class/interface per file unless tightly coupled
- Group related functionality in directories
- Use consistent file naming:
  - `.service.ts` for services
  - `.controller.ts` for controllers
  - `.adapter.ts` for adapters
  - `.repository.ts` for repositories

### Code Structure

- Keep functions small and focused
- Maximum of 3 parameters per function
- Use early returns to reduce nesting

```typescript
// Good
function validateUser(user: IUser): boolean {
if (!user.name) return false;
if (!user.email) return false;
return true;
}
// Bad
function validateUser(user: IUser): boolean {
if (user.name) {
if (user.email) {
return true;
}
}
return false;
}
```

### Comments and Documentation

- Use JSDoc for public APIs and complex functions
- Write comments for non-obvious business logic
- Keep comments up-to-date with code changes

```typescript
/**
* Processes user authentication
* @param credentials User login credentials
* @returns Authentication result with token
* @throws AuthenticationError if credentials are invalid
*/
async function authenticate(credentials: ICredentials): Promise<IAuthResult>
```

### Constants and Configuration

- Use camelCase for variables, functions, and method names.
- Use PascalCase for class names and interface names.
- Use UPPER_CASE for constant values
- Group related constants in domain/keys
- Use environment variables for configuration

```typescript

export const domainKeys = {
STORAGE_PREFIX: 'xrt-q23e',
MAX_RETRIES: 3
};
```

### Testing

- Write unit tests for business logic
- Use meaningful test descriptions
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
it('should return user when valid ID provided', async () => {
// Arrange
const id = 'valid-id';
// Act
const result = await userService.getUser(id);
// Assert
expect(result).toBeDefined();
});
});
```

## Continuous Integration

Automated Checks: Integrate linting and formatting checks into the CI/CD pipeline to ensure code quality.

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint](https://eslint.org/)

## Additional Guidelines

- Use dependency injection for better testability and modularity
- Follow the hexagonal architecture patterns defined in the project structure
- Implement proper error handling using the core error utilities
- Use the provided base classes and interfaces from @monomod/core

For detailed project structure and architecture guidelines, refer to:

- [Project Structure](./structure.md)
- [Architecture Guide](./architecture.md)

By following these guidelines, we can maintain a clean, consistent, and maintainable codebase for the monomod project.
