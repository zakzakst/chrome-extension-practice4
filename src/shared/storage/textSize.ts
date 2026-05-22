const STORAGE_KEY = "chrome-memo-text-size";

export const saveTextSize = async (value: string) => {
  await chrome.storage.local.set({
    [STORAGE_KEY]: value,
  });
};

export const loadTextSize = async (): Promise<string> => {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return (result[STORAGE_KEY] as string) || "";
};
