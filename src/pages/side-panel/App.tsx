import { useCallback, useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { loadMemoText, saveMemoText } from "@/src/shared/storage/memoText";
import { loadTextSize } from "@/src/shared/storage/textSize";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

// TODO:
// - 音声入力。モードをショートカットで切り替えることができる
//   - https://zenn.dev/hayato94087/articles/25d1912377e5bf
// - 選択箇所のマークダウン変換

// TODO: 次やる
// - テンプレート登録とその挿入

const App = () => {
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState("");

  // 初回メモ情報反映
  useEffect(() => {
    const init = async () => {
      const memoText = await loadMemoText();
      setText(memoText);
    };
    init();
  }, []);

  // テキストサイズ反映
  useEffect(() => {
    const init = async () => {
      const textSize = await loadTextSize();
      setTextSize(textSize || "sm");
    };
    init();
  });

  // 自動保存
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveMemoText(text);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    [setText],
  );

  const handleCopy = useCallback(() => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        toast("コピーしました", { duration: 1000 });
      });
    }
  }, [text]);

  return (
    <div className="grid h-screen grid-rows-[max-content_1fr] gap-4 p-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          disabled={text === ""}
          onClick={() => setText("")}
        >
          クリア
        </Button>
        <Button onClick={handleCopy} disabled={text === ""}>
          コピー
        </Button>
      </div>
      <Textarea
        value={text}
        className={cn("resize-none", `text-${textSize}`)}
        onChange={handleChange}
      />
    </div>
  );
};

export default App;
