import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  type SheetData,
  type SheetDataItem,
  fetchSheetDataFromUrl,
  getSheetData,
  getSheetDataUrl,
  setSheetData,
} from "@/shared/storage";
import { toast } from "sonner";

const App = () => {
  const [sheetDataUrl, setSheetDataUrlState] = useState<string>("");
  const [sheetData, setSheetDataState] = useState<SheetData>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const storedUrl = await getSheetDataUrl();
      const storedSheetData = await getSheetData();

      if (storedUrl) {
        setSheetDataUrlState(storedUrl);
      }

      if (storedSheetData) {
        setSheetDataState(storedSheetData);
      }
    })();
  }, []);

  const activeSheet = useMemo(
    () => sheetData[activeTabIndex],
    [activeTabIndex, sheetData],
  );

  const handleRefresh = useCallback(async () => {
    if (!sheetDataUrl.trim()) {
      toast.error("シートデータ取得URLが設定されていません。");
      return;
    }

    try {
      setIsRefreshLoading(true);
      const data = await fetchSheetDataFromUrl(sheetDataUrl.trim());
      await setSheetData(data);
      setSheetDataState(data);
      setActiveTabIndex(0);
      toast.success("シートデータを更新しました。");
    } catch (error) {
      toast.error("シートデータの取得に失敗しました。");
    } finally {
      setIsRefreshLoading(false);
    }
  }, [sheetDataUrl]);

  const handleCopyItem = useCallback(async (item: SheetDataItem) => {
    try {
      await navigator.clipboard.writeText(item.content);
      toast.success("コンテンツをコピーしました。", { duration: 1000 });
    } catch (error) {
      toast.error("クリップボードへのコピーに失敗しました。");
    }
  }, []);

  return (
    <div className="w-md space-y-4 p-4">
      <div>
        <Button onClick={handleRefresh} disabled={isRefreshLoading}>
          シートデータ更新
        </Button>
      </div>

      {sheetData.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
          シートデータが見つかりません
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {sheetData.map((sheet, index) => (
              <button
                key={sheet.sheetName}
                type="button"
                onClick={() => setActiveTabIndex(index)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  index === activeTabIndex
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {sheet.sheetName}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {activeSheet?.data.length ? (
              activeSheet.data.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => void handleCopyItem(item)}
                  className="hover:border-primary hover:bg-primary/5 w-full rounded-lg border border-slate-300 bg-white p-3 text-left text-sm transition"
                >
                  {item.name}
                </button>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                表示するデータがありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
