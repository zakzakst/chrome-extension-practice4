import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

// TODO: パネルを閉じると初期化するからストレージで保持したい
// ショートカット案 ctr + alt + m ⇒ 設定ページでカスタマイズできるのが理想

const App = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleClear = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  }, [textareaRef]);

  const handleCopy = useCallback(() => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          toast("コピーしました", { position: "top-right", duration: 1000 });
        });
      }
    }
  }, [textareaRef]);

  return (
    <div className="grid h-screen grid-rows-[1fr_max-content] gap-4 p-4">
      <Textarea ref={textareaRef} className="resize-none" />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={handleClear}>
          クリア
        </Button>
        <Button onClick={handleCopy}>コピー</Button>
      </div>
    </div>
  );
};

export default App;
