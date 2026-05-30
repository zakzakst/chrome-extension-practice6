import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSheetDataUrl, setSheetDataUrl } from "@/shared/storage";

const App = () => {
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const storedUrl = await getSheetDataUrl();
      if (storedUrl) {
        setUrl(storedUrl);
      }
    })();
  }, []);

  const handleSave = useCallback(async () => {
    if (!url.trim()) {
      toast.error("URLを入力してください。");
      return;
    }

    try {
      setIsSaving(true);
      await setSheetDataUrl(url.trim());
      toast.success("API設定を保存しました。");
    } catch (error) {
      toast.error("保存に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  }, [url]);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-semibold">オプション</h1>
      <div className="space-y-2">
        <label className="block text-sm font-medium">シートデータ取得URL</label>
        <input
          className="focus:border-primary focus:ring-primary/20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/sheet-data.json"
          type="url"
        />
      </div>
      <Button onClick={handleSave} disabled={isSaving}>
        API設定
      </Button>
    </div>
  );
};

export default App;
