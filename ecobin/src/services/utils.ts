export const getToken = async (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).chrome?.storage?.local) {
      const chrome = (window as any).chrome;
      chrome.storage.local.get("token", (result: { [key: string]: any }) => {
        if (chrome.runtime?.lastError) {
          reject(new Error(chrome.runtime.lastError));
        } else {
          resolve(result.token || null);
        }
      });
    } else {
      // Fallback to localStorage if chrome storage is not available
      if (typeof window !== "undefined") {
        resolve(localStorage.getItem("token"));
      } else {
        resolve(null);
      }
    }
  });
};
