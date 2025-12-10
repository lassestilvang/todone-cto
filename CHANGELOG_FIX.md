# Fix: Dexie KeyPath Indexes and bcryptjs Crypto Warning

## Summary
Fixed critical Dexie schema errors, eliminated bcryptjs crypto warning, and resolved React checkbox warnings in browser console when running `npm run dev`.

## Changes Made

### 1. Database Schema Update (`src/lib/database.ts`)
- Created version 2 of Dexie schema with proper indexes
- Added `order` index to: `projects`, `sections`, `tasks`
- Added `name` index to: `filters`
- Preserves version 1 schema for automatic migration
- Dexie handles migration transparently, preserving all existing data

### 2. Crypto Shim (`src/shims/crypto.ts`) [NEW FILE]
- Created browser-compatible crypto module
- Implements `randomBytes()` using Web Crypto API (`crypto.getRandomValues()`)
- Provides drop-in replacement for Node.js crypto module
- Properly typed with TypeScript

### 3. Vite Configuration (`vite.config.ts`)
- Added alias mapping: `crypto` → `src/shims/crypto.ts`
- Tells Vite to use browser-compatible shim instead of Node.js crypto
- Eliminates "Module crypto has been externalized" warning
- Maintains full bcryptjs functionality

### 4. Auth Module (`src/lib/auth.ts`)
- Added `BCRYPT_ROUNDS` constant (value: 10)
- Created helper functions: `hashPassword()`, `verifyPassword()`
- Maintains all existing functionality
- No breaking changes to API

### 5. Checkbox Warnings (`TaskItem.tsx`, `SubTaskItem.tsx`)
- Added `onChange` handlers to checkbox components
- Stopped propagation on wrapper divs to preserve original UX
- Removed React warnings about read-only checkboxes

### 6. Documentation (`FIXES.md`) [NEW FILE]
- Detailed explanation of issues and solutions
- Migration notes for users
- Testing verification

## Files Modified
- `src/lib/database.ts` - Added schema v2 with indexes
- `src/lib/auth.ts` - Refactored bcrypt usage
- `vite.config.ts` - Added crypto alias
- `src/components/tasks/TaskItem.tsx` - Added onChange handler to Checkbox
- `src/components/tasks/SubTaskItem.tsx` - Added onChange handler to Checkbox
- `package.json` - Updated bcryptjs from 2.4.3 to 3.0.3, @types/bcryptjs to 2.4.6
- `package-lock.json` - Updated from package.json changes

## Files Added
- `src/shims/crypto.ts` - Browser crypto shim
- `FIXES.md` - Detailed fix documentation
- `CHANGELOG_FIX.md` - This file

## Testing Results
✅ All checks pass:
- TypeScript: `npm run typecheck` - 0 errors
- ESLint: `npm run lint` - 0 warnings
- Build: `npm run build` - Success (936.98 KB)

## Impact
- **Before**: 6+ console errors blocking app functionality + React checkbox warnings
- **After**: Clean console (only informational React Router warnings remain)
- **Performance**: No impact, bundle size increased ~20KB (crypto shim, bcryptjs update)
- **Breaking Changes**: None - fully backward compatible

## Migration Guide
No user action required. The app will automatically:
1. Detect database version 1
2. Migrate to version 2 with new indexes
3. Preserve all existing data
4. Use crypto shim for bcryptjs operations

For users who already have data, the migration is seamless and happens on next page load.

## Notes
- React Router future flag warnings remain (informational only, not errors)
- Bundle size still within acceptable limits (< 1 MB)
- All existing functionality preserved
- No API changes
