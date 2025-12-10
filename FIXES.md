# Fixes Applied

## Issues Resolved

### 1. Dexie Schema Errors (CRITICAL)
**Problem**: KeyPath fields (`order`, `name`) were not indexed in the database schema, causing errors when using `orderBy()` queries.

**Error Messages**:
- `KeyPath order on object store tasks is not indexed`
- `KeyPath order on object store projects is not indexed`
- `KeyPath name on object store filters is not indexed`

**Solution**: Updated database schema to version 2 with the following indexes added:
- `projects`: Added `order` index
- `sections`: Added `order` index
- `tasks`: Added `order` index
- `filters`: Added `name` index

**Migration**: Dexie automatically migrates from version 1 to version 2. Existing data is preserved.

### 2. bcryptjs Crypto Warning
**Problem**: bcryptjs was attempting to use Node.js's `crypto.randomBytes` which is not available in the browser, causing warnings in the console.

**Warning Message**:
```
Module "crypto" has been externalized for browser compatibility. 
Cannot access "crypto.randomBytes" in client code.
```

**Solution**: Created a browser-compatible crypto shim (`src/shims/crypto.ts`) that provides `randomBytes` using Web Crypto API, and configured Vite to use this shim when bcryptjs tries to import the Node.js crypto module. This approach:
- Keeps bcryptjs for password hashing (proper security)
- Provides browser-compatible random number generation
- Eliminates the warning completely
- Maintains compatibility with existing password hashes

## Testing

All quality checks pass:
- ✅ TypeScript type checking (`npm run typecheck`)
- ✅ ESLint (`npm run lint`)
- ✅ Production build (`npm run build`)

## Recommendations

If you encounter any database-related issues after updating:
1. Clear your browser's IndexedDB for the site (DevTools → Application → IndexedDB → Delete `todone` database)
2. Reload the page - Dexie will recreate the database with the new schema

The app should now run without console errors or warnings (except for the React Router future flag warnings, which are informational only).
