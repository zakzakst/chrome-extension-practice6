import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const App = () => {
  const handleClick = useCallback(() => {
    toast("ボタンクリック");
  }, []);

  return (
    <div className="p-4">
      <h1>ポップアップ</h1>
      <div>
        <Button onClick={handleClick}>ボタン</Button>
      </div>
    </div>
  );
};

export default App;
