# monomod Code Style Guide

This guide outlines the coding conventions and style guidelines for the monomod project. Adhering to these standards ensures code consistency, readability, and maintainability.

## General Principles

- Readability First: Prioritize code clarity and understandability. Write code for humans, not just machines.
- Consistency: Maintain a consistent coding style throughout the project. Follow the established patterns and conventions.
- Simplicity: Strive for simplicity in code structure and logic. Avoid unnecessary complexity.
- Self-Documenting Code: Use meaningful variable and function names. Write code that is self-explanatory.

## Specific Guidelines

You can refeer to the [editor config](../.editorconfig), the [eslint](../.eslintrc.json) and the [prettier](../.prettierrc) files to see the main code guidelines

- Variable Declarations: Use const for constants and let for variables.
- Type Annotations: Provide explicit type annotations for variables, function parameters, and return types.
- Imports: Use named imports for clarity.
- Comments: Write clear and concise comments to explain complex logic or non-obvious behavior.
- Naming Conventions:
  - Use camelCase for variables, functions, and method names.
  - Use PascalCase for class names and interface names.
  - Use UPPER_CASE for constants.
  - The interfaces must begin with the "I" capital letter followed by the name of the interface in PascalCase, e.g. IUserService.
  - The types must begin with the "T" capital letter followed by the name of the type in PascalCase, e.g. TUser.

## Continuous Integration

Automated Checks: Integrate linting and formatting checks into the CI/CD pipeline to ensure code quality.

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [ESLint](https://eslint.org/)

By following these guidelines, we can maintain a clean, consistent, and maintainable codebase for the monomod project.
