/**
 * Database migration utilities
 * Handles IndexedDB schema migrations and version checks
 */

export const checkDatabaseVersion = async (): Promise<number> => {
  return new Promise((resolve) => {
    const request = indexedDB.open('todone');
    
    request.onsuccess = () => {
      const db = request.result;
      const version = db.version;
      db.close();
      resolve(version);
    };
    
    request.onerror = () => {
      resolve(0);
    };
  });
};

export const clearDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('todone');
    
    request.onsuccess = () => {
      console.log('Database cleared successfully');
      resolve();
    };
    
    request.onerror = () => {
      console.error('Failed to clear database');
      reject(new Error('Failed to clear database'));
    };
    
    request.onblocked = () => {
      console.warn('Database deletion blocked - close all tabs and try again');
      reject(new Error('Database deletion blocked'));
    };
  });
};

/**
 * Check if database needs migration and prompt user
 */
export const checkAndPromptMigration = async (): Promise<boolean> => {
  const currentVersion = await checkDatabaseVersion();
  
  // If version is 1, we need to upgrade to version 2
  if (currentVersion === 1) {
    const shouldMigrate = confirm(
      'Database upgrade required. Your data will be preserved, but you may need to clear the database if you experience issues. Would you like to continue?'
    );
    
    if (shouldMigrate) {
      // Dexie will handle the migration automatically
      // No need to clear the database
      return true;
    } else {
      return false;
    }
  }
  
  return true;
};

/**
 * Force clear database if user is experiencing issues
 * This should be used as a last resort
 */
export const forceClearDatabase = async (): Promise<void> => {
  if (confirm('This will delete ALL your data. Are you sure?')) {
    await clearDatabase();
    window.location.reload();
  }
};
