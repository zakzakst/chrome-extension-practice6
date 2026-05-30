export type SheetDataItem = {
  name: string;
  content: string;
};

export type SheetData = {
  sheetName: string;
  data: SheetDataItem[];
}[];

const SHEET_DATA_URL_KEY = "シートデータ取得URL";
const SHEET_DATA_KEY = "シートデータ";

const getStorageValue = async <T>(key: string): Promise<T | undefined> => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (items) => {
      resolve(items[key] as T | undefined);
    });
  });
};

const setStorageValue = async <T>(key: string, value: T): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
};

export const getSheetDataUrl = async (): Promise<string | undefined> => {
  return getStorageValue<string>(SHEET_DATA_URL_KEY);
};

export const setSheetDataUrl = async (url: string): Promise<void> => {
  await setStorageValue(SHEET_DATA_URL_KEY, url);
};

export const getSheetData = async (): Promise<SheetData | undefined> => {
  return getStorageValue<SheetData>(SHEET_DATA_KEY);
};

export const setSheetData = async (value: SheetData): Promise<void> => {
  await setStorageValue(SHEET_DATA_KEY, value);
};

export const fetchSheetDataFromUrl = async (
  url: string,
): Promise<SheetData> => {
  if (!url) {
    throw new Error("シートデータ取得URLが設定されていません。");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`データ取得に失敗しました (${response.status})`);
  }

  const data = await response.json();
  return data as SheetData;
};
