// Type declarations for Chrome storage
declare global {
  interface Window {
    chrome?: {
      storage?: {
        local?: {
          set: (items: { [key: string]: any }, callback?: () => void) => void;
          get: (keys: string[], callback: (result: { [key: string]: any }) => void) => void;
          remove: (keys: string[], callback?: () => void) => void;
        };
      };
      runtime?: {
        lastError?: any;
      };
    };
  }
}

// Function to create or update data in storage
export function setItem(key: string, value: string): Promise<void> {
  if (typeof window !== "undefined" && window.chrome?.storage?.local) {
    return new Promise((resolve, reject) => {
      try {
        window.chrome!.storage!.local!.set({ [key]: value }, () => {
          if (window.chrome?.runtime?.lastError) {
            reject(window.chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
    return Promise.resolve();
  }
}

// Function to read data from storage
export function getItem(key: string): Promise<string | null> {
  if (typeof window !== "undefined" && window.chrome?.storage?.local) {
    return new Promise((resolve, reject) => {
      try {
        window.chrome!.storage!.local!.get([key], (result: { [key: string]: any }) => {
          if (window.chrome?.runtime?.lastError) {
            reject(window.chrome.runtime.lastError);
          } else {
            resolve(result[key] !== undefined ? result[key] : null);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    if (typeof window !== "undefined") {
      return Promise.resolve(localStorage.getItem(key));
    }
    return Promise.resolve(null);
  }
}

// Function to remove data from storage
export function removeItem(key: string): Promise<void> {
  if (typeof window !== "undefined" && window.chrome?.storage?.local) {
    return new Promise((resolve, reject) => {
      try {
        window.chrome!.storage!.local!.remove([key], () => {
          if (window.chrome?.runtime?.lastError) {
            reject(window.chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    return Promise.resolve();
  }
}
