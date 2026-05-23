const STORAGE_KEY = "chrome-memo-templates";

export type Template = {
  name: string;
  text: string;
};

export const saveTemplates = async (templates: Template[]) => {
  await chrome.storage.local.set({
    [STORAGE_KEY]: JSON.stringify(templates),
  });
};

export const loadTemplates = async (): Promise<Template[]> => {
  const result = await chrome.storage.local.get(STORAGE_KEY);

  return result[STORAGE_KEY]
    ? (JSON.parse(result[STORAGE_KEY] as string) as Template[])
    : [];
};
