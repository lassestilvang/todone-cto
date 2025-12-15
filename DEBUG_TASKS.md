# Debugging "Cannot Add Task" Issue

## Console Errors Analysis

The errors you're seeing (`content_script.js`) are from a **browser extension**, NOT from the Todone app. These are typically from:
- Password managers (LastPass, 1Password, Dashlane)
- Grammar checkers (Grammarly)
- Form auto-fill extensions

**These do NOT affect the app's functionality.**

## Steps to Fix "Cannot Add Task"

### 1. Clear IndexedDB (Database Migration)
The database schema was upgraded from v1 to v2. You may need to clear the old database:

**Option A: Using Browser DevTools**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **IndexedDB** in the left sidebar
4. Right-click on **todone** database
5. Select **Delete database**
6. Refresh the page (Ctrl+R)

**Option B: Using Console**
1. Open DevTools Console (F12)
2. Paste and run:
```javascript
indexedDB.deleteDatabase('todone')
```
3. Refresh the page (Ctrl+R)

### 2. Hard Refresh
Clear cached JavaScript:
- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

### 3. Disable Browser Extensions
Temporarily disable extensions to avoid interference:
1. Open browser extensions page
2. Disable all extensions
3. Reload the app
4. Try adding a task

### 4. Check for Real App Errors
In the console, look for errors from **localhost:3000** or **chunk-**.
Ignore all errors from `content_script.js`.

## Expected Behavior

When you type a task and click "Add task", you should see:
1. No errors in console (except React Router warnings - those are normal)
2. Task appears in the list immediately
3. Database stores the task

## If Issue Persists

Please check:
1. Are you logged in? (The app requires authentication)
2. Can you see the TaskComposer input field?
3. Does the "Add task" button show as disabled or loading?
4. Are there ANY errors from the app itself (not from `content_script.js`)?

## Test in Clean Environment

Try opening the app in an **Incognito/Private window** with:
- No extensions loaded
- Clean IndexedDB
- No cached files

This will help determine if the issue is environment-related.
