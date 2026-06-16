import {
  type ChangeEvent,
  type WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { loadMemoText, saveMemoText } from "@/src/shared/storage/memoText";
import { type Template, loadTemplates } from "@/src/shared/storage/templates";
import { loadTextSize, saveTextSize } from "@/src/shared/storage/textSize";
import { toast } from "sonner";

// TODO:
// - 音声入力。モードをショートカットで切り替えることができる
//   - https://zenn.dev/hayato94087/articles/25d1912377e5bf

const App = () => {
  const [text, setText] = useState("");
  const [textSize, setTextSize] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 初回メモ情報反映
  useEffect(() => {
    const init = async () => {
      const memoText = await loadMemoText();
      setText(memoText);
    };
    init();
  }, [setText]);

  // テキストサイズ反映
  useEffect(() => {
    const init = async () => {
      const textSize = await loadTextSize();
      setTextSize(textSize || "sm");
    };
    init();
  }, [setTextSize]);

  // テンプレート情報反映
  useEffect(() => {
    const init = async () => {
      const templates = await loadTemplates();
      setTemplates(templates);
    };
    init();
  }, [setTemplates]);

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

  const handleInsertTemplate = useCallback(
    (template: Template) => {
      if (!textareaRef.current) return;
      const startPos = textareaRef.current.selectionStart;
      const endPos = textareaRef.current.selectionEnd;
      const newText =
        text.slice(0, startPos) + template.text + text.slice(endPos);
      setText(newText);
    },
    [textareaRef, text, setText],
  );

  const handleWheel = useCallback(
    async (e: WheelEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey) return;

      if (e.deltaY < 0) {
        switch (textSize) {
          case "xs":
            await saveTextSize("sm");
            setTextSize("sm");
            break;
          case "sm":
            await saveTextSize("base");
            setTextSize("base");
            break;
          default:
            break;
        }
      } else {
        switch (textSize) {
          case "sm":
            await saveTextSize("xs");
            setTextSize("xs");
            break;
          case "base":
            await saveTextSize("sm");
            setTextSize("sm");
            break;
          default:
            break;
        }
      }
    },
    [textSize, setTextSize],
  );

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
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Textarea
            value={text}
            className={cn("resize-none", `text-${textSize}`)}
            onChange={handleChange}
            onWheel={handleWheel}
            ref={textareaRef}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          {!templates.length && (
            <ContextMenuItem disabled>登録テンプレートなし</ContextMenuItem>
          )}
          {!!templates.length &&
            templates.map((template) => (
              <ContextMenuItem
                key={template.name}
                onClick={() => handleInsertTemplate(template)}
              >
                {template.name}
              </ContextMenuItem>
            ))}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default App;
