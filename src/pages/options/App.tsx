import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadTextSize, saveTextSize } from "@/src/shared/storage/textSize";
import { saveTemplates } from "@/src/shared/storage/templates";
import { toast } from "sonner";

type TextSizeItem = {
  value: string;
  label: string;
};

const TextSizeItems: TextSizeItem[] = [
  {
    value: "xs",
    label: "xs",
  },
  {
    value: "sm",
    label: "sm",
  },
  {
    value: "base",
    label: "base",
  },
];

const App = () => {
  const [textSize, setTextSize] = useState("");

  // 初回テキストサイズ反映
  useEffect(() => {
    const init = async () => {
      const textSize = await loadTextSize();
      setTextSize(textSize || "sm");
    };
    init();
  }, []);

  const handleChangeTextSize = useCallback(
    (value: string) => {
      setTextSize(value);
    },
    [setTextSize],
  );

  const handleSave = useCallback(async () => {
    await saveTextSize(textSize);
    await saveTemplates([
      {
        name: "test",
        text: "## test text",
      },
    ]);
    toast("設定を保存しました", { duration: 1000 });
  }, [textSize]);

  return (
    <div className="p-4">
      <div>
        <h1 className="text-2xl font-bold">設定ページ</h1>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div>テキストサイズ</div>
            <Select value={textSize} onValueChange={handleChangeTextSize}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="テキストサイズを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {TextSizeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleSave}>設定を保存</Button>
        </div>
      </div>
    </div>
  );
};

export default App;
