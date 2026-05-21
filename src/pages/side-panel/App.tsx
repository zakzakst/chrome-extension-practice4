import { useCallback, useState, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { loadMemoText, saveMemoText } from "@/src/shared/storage/memoText";

import { toast } from "sonner";

const App = () => {
  const [text, setText] = useState("");

  // 初回復元
  useEffect(() => {
    const init = async () => {
      const memoText = await loadMemoText();
      setText(memoText);
    };
    init();
  }, []);

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
      <Textarea value={text} className="resize-none" onChange={handleChange} />
    </div>
  );
};

export default App;
