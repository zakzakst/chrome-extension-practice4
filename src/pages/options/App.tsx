import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type Template,
  loadTemplates,
  saveTemplates,
} from "@/src/shared/storage/templates";
import { loadTextSize, saveTextSize } from "@/src/shared/storage/textSize";
import { toast } from "sonner";
import Papa from "papaparse";

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

const escapeCsvValue = (value: unknown) => {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
};

const App = () => {
  const [textSize, setTextSize] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const templateNameRef = useRef<HTMLInputElement>(null);
  const templateTextRef = useRef<HTMLTextAreaElement>(null);

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

  const handleChangeTextSize = useCallback(
    (value: string) => {
      setTextSize(value);
    },
    [setTextSize],
  );

  const handleDeleteTemplate = useCallback(
    (index: number) => {
      const newTemplates = templates.filter(
        (_, templateIndex) => templateIndex !== index,
      );
      setTemplates(newTemplates);
    },
    [templates, setTemplates],
  );

  const handleAddTemplate = useCallback(() => {
    const nameEl = templateNameRef.current;
    const textEl = templateTextRef.current;
    if (!nameEl || !textEl) return;

    if (nameEl.value && textEl.value) {
      setTemplates((current) => [
        ...current,
        { name: nameEl.value, text: textEl.value },
      ]);
      nameEl.value = "";
      textEl.value = "";
      toast("テンプレートを追加しました", { duration: 1000 });
    }
  }, [setTemplates, templateNameRef, templateTextRef]);

  const handleSave = useCallback(async () => {
    await saveTextSize(textSize);
    await saveTemplates(templates);
    toast("設定を保存しました", { duration: 1000 });
  }, [templates, textSize]);

  const handleDownloadCsv = useCallback(() => {
    const headers = ["name", "text"];
    const csv = [
      headers.join(","),
      ...templates.map((template) =>
        headers
          .map((header) =>
            escapeCsvValue(template[header as keyof typeof template]),
          )
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "templates.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [templates]);

  const handleLoadCsv = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      // const reader = new FileReader();
      // reader.onload = () => {
      //   const csvText = reader.result as string;

      //   const rows = csvText
      //     .trim()
      //     .split("\n")
      //     .map((row) => row.split(","));

      //   const headers = rows[0];

      //   const data = rows
      //     .slice(1)
      //     .map((row) =>
      //       Object.fromEntries(
      //         headers.map((header, index) => [header, row[index]]),
      //       ),
      //     );
      //   console.log(data);
      // };
      // reader.readAsText(file);

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // TODO: CSVデータのバリデーション
          // console.log(results.data);
          setTemplates((value) => [...value, ...(results.data as Template[])]);
          // TODO: inputファイルデータのクリア
        },
      });
    },
    [setTemplates],
  );

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

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div>テンプレート</div>
            <div>
              {!templates.length && (
                <div>登録されたテンプレートはありません</div>
              )}
              {!!templates.length && (
                <ul className="list-disc">
                  {templates.map((template, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{template.name}</span>
                      <Button
                        size="xs"
                        onClick={() => handleDeleteTemplate(index)}
                      >
                        X
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">テンプレートを追加する</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>テンプレート追加フォーム</DialogTitle>
                      <DialogDescription>
                        フォームを入力してください
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <Field>
                        <FieldLabel htmlFor="template-name">
                          テンプレート名
                        </FieldLabel>
                        <Input id="template-name" ref={templateNameRef} />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="template-text">
                          テンプレート文
                        </FieldLabel>
                        <Textarea id="template-text" ref={templateTextRef} />
                      </Field>
                    </div>
                    <DialogFooter>
                      <div className="grid grid-cols-2 gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">閉じる</Button>
                        </DialogClose>
                        <Button onClick={handleAddTemplate}>追加</Button>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div />
            <div>
              <Button onClick={handleDownloadCsv}>
                テンプレートデータをCSVでダウンロード
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div />
            <div>
              <div>
                <Input type="file" accept=".csv" onChange={handleLoadCsv} />
              </div>
            </div>
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
