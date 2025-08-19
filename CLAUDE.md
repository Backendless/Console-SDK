# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Backendless Console SDK is a JavaScript SDK that provides access to Backendless Console Management APIs for administrative and management functions. It supports both Node.js and browser environments and generates multiple build targets (CommonJS, ES modules, and UMD bundles).

## Development Commands

```bash
# Linting
npm run lint                    # Run ESLint on source files

# Building
npm run clean                   # Remove build artifacts
npm run build:commonjs          # Build CommonJS version to lib/
npm run build:es               # Build ES modules to es/
npm run build:umd              # Build UMD bundle for development
npm run build:umd:min          # Build minified UMD bundle
npm run build                  # Build all targets

# Development workflow
npm run check                  # Run lint and test (currently test is empty)
npm run prepare               # Full pipeline: clean, check, build
```

## Architecture

### Core Client Structure
- `src/index.js` - Main entry point with `createClient()` factory function
- Creates a context-aware request system that handles authentication and multiple service endpoints
- Supports multiple backend URLs (billing, community, SQL service, automation, node API)

### API Module Pattern
Each API module follows a consistent pattern:
- Located in `src/` directory (e.g., `apps.js`, `users.js`, `tables.js`)
- Exports a function that takes a request object and returns API methods
- Uses route definitions with parameter placeholders (`:appId`, `:userId`)
- Route building handled by `src/utils/routes.js` with `prepareRoutes()` function

### Key Components
- **Context Class**: Manages authentication keys and middleware
- **Request Wrapper**: Contextifies requests with auth headers and server URLs
- **Route System**: Dynamic route building with parameter substitution
- **Module Registration**: All API modules registered in main index.js

### Build System
- **Babel**: Transpiles ES6+ to compatible JavaScript (`.babelrc` configuration)
- **Webpack**: Bundles UMD builds for browser usage (`webpack.config.js`)
- **Multi-target**: Generates CommonJS (`lib/`), ES modules (`es/`), and UMD (`dist/`) builds

### API Categories
The SDK covers these main functional areas:
- Application management (`apps.js`)
- User and team management (`users.js`, `dev-team.js`)
- Data operations (`tables.js`, `data-views.js`, `sql-service.js`)
- Cloud code and automation (`cloud-code.js`, `automation.js`)
- Security and permissions (`security.js`, `dev-permissions.js`)
- UI and visualization tools (`ui-builder.js`, `chart-builder.js`)
- Billing and marketplace (`billing/`, `marketplace.js`)
- Analytics and monitoring (`analytics.js`, `status.js`)

## Working with the Codebase

When adding new API modules:
1. Create module in `src/` following existing pattern
2. Define routes using `prepareRoutes()` utility
3. Export function that takes request object
4. Register in `src/index.js` main API object
5. Build will automatically include in all targets
