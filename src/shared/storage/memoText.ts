const STORAGE_KEY = "chrome-memo-text";

export const saveMemoText = async (value: string) => {
  await chrome.storage.local.set({
    [STORAGE_KEY]: value,
  });
};

export const loadMemoText = async (): Promise<string> => {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return (result[STORAGE_KEY] as string) || "";
};
