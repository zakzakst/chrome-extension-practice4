import {
  type ChangeEvent,
  useCallback,
  useEffect,
  // useRef,
  useState,
} from "react";

import {
  TemplateDialog,
  type TemplateDialogType,
} from "@/components/features/options/TemplateDialog";
import { TemplateList } from "@/components/features/options/TemplateList";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
import {
  type Template,
  TemplateSchema,
  loadTemplates,
  saveTemplates,
} from "@/src/shared/storage/templates";
import { loadTextSize, saveTextSize } from "@/src/shared/storage/textSize";
import Papa from "papaparse";
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

const escapeCsvValue = (value: unknown) => {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
};

const App = () => {
  const [textSize, setTextSize] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [openTemplateDialog, setOpenTemplateDialog] = useState<boolean>(false);
  const [templateDialogTarget, setTemplateDialogTarget] =
    useState<Template | null>(null);
  const [templateDialogType, setTemplateDialogType] =
    useState<TemplateDialogType | null>(null);
  // const templateNameRef = useRef<HTMLInputElement>(null);
  // const templateTextRef = useRef<HTMLTextAreaElement>(null);

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

  const handleCreateTemplate = useCallback(() => {
    // テンプレート編集ダイアログ表示
    setTemplateDialogTarget(null);
    setTemplateDialogType("create");
    setOpenTemplateDialog(true);
  }, [setTemplateDialogTarget, setTemplateDialogType, setOpenTemplateDialog]);

  const handleEditTemplate = useCallback(
    (targetTemplate: Template) => {
      // テンプレート編集ダイアログ表示
      setTemplateDialogTarget(targetTemplate);
      setTemplateDialogType("edit");
      setOpenTemplateDialog(true);
    },
    [setTemplateDialogTarget, setTemplateDialogType, setOpenTemplateDialog],
  );

  const handleDeleteTemplate = useCallback(
    (targetTemplate: Template) => {
      const newTemplates = templates.filter(
        (template) => template !== targetTemplate,
      );
      setTemplates(newTemplates);
    },
    [templates, setTemplates],
  );

  // const handleAddTemplate = useCallback(() => {
  //   const nameEl = templateNameRef.current;
  //   const textEl = templateTextRef.current;
  //   if (!nameEl || !textEl) return;

  //   if (nameEl.value && textEl.value) {
  //     setTemplates((current) => [
  //       ...current,
  //       { name: nameEl.value, text: textEl.value },
  //     ]);
  //     nameEl.value = "";
  //     textEl.value = "";
  //     toast("テンプレートを追加しました", { duration: 1000 });
  //   }
  // }, [setTemplates, templateNameRef, templateTextRef]);

  const closeTemplateDialog = useCallback(() => {
    setOpenTemplateDialog(false);
    setTemplateDialogTarget(null);
    setTemplateDialogType(null);
  }, [setOpenTemplateDialog, setTemplateDialogTarget, setTemplateDialogType]);

  const handleTemplateDialogSubmit = useCallback(
    (newTemplate: Template) => {
      if (templateDialogType === "create") {
        setTemplates((current) => [...current, newTemplate]);
      } else if (templateDialogType === "edit") {
        const newTemplates = templates.map((template) => {
          if (template === templateDialogTarget) {
            return newTemplate;
          } else {
            return template;
          }
        });
        setTemplates(newTemplates);
      }
      closeTemplateDialog();
    },
    [
      templates,
      templateDialogTarget,
      templateDialogType,
      setTemplates,
      closeTemplateDialog,
    ],
  );

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
          const templates = results.data.map((row) =>
            TemplateSchema.parse(row),
          );
          setTemplates((value) => [...value, ...(templates as Template[])]);
          // inputファイルデータのクリア
          event.target.value = "";
        },
      });
    },
    [setTemplates],
  );

  return (
    <>
      <div className="p-4">
        <div className="max-w-2xl">
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
                {/* {!templates.length && (
                  <div>登録されたテンプレートはありません</div>
                )} */}
                <TemplateList
                  templates={templates}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                />
                <div className="mt-2">
                  <Button onClick={handleCreateTemplate}>
                    新規テンプレート作成
                  </Button>
                  {/* <Dialog>
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
                </Dialog> */}
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
                  {/* TODO: Inputファイルの表示変更 */}
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
      <TemplateDialog
        template={templateDialogTarget}
        type={templateDialogType}
        open={openTemplateDialog}
        onSubmit={handleTemplateDialogSubmit}
        onClose={closeTemplateDialog}
      />
    </>
  );
};

export default App;
