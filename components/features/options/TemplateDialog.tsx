import {
  useCallback,
  // useEffect,
  useMemo,
  useRef,
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
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Template } from "@/src/shared/storage/templates";

export type TemplateDialogType = "create" | "edit";

type Props = {
  template: Template | null;
  type: TemplateDialogType | null;
  open: boolean;
  onSubmit: (template: Template) => void;
  onClose: () => void;
};

export const TemplateDialog = ({
  template,
  type,
  open,
  onSubmit,
  onClose,
}: Props) => {
  const templateNameRef = useRef<HTMLInputElement>(null);
  const templateTextRef = useRef<HTMLTextAreaElement>(null);

  // useEffect(() => {
  //   console.log(template, templateNameRef.current, templateTextRef.current);
  //   if (!templateNameRef.current || !templateTextRef.current || !template)
  //     return;
  //   // templateNameRef.current.value = template.name;
  //   // templateTextRef.current.value = template.text;
  // }, [template, templateNameRef.current, templateTextRef.current]);

  const titleText = useMemo<string>(() => {
    if (type === "create") {
      return "テンプレート追加フォーム";
    } else if (type === "edit") {
      return "テンプレート編集フォーム";
    } else {
      return "";
    }
  }, [type]);

  const handleSubmit = useCallback(() => {
    const newTemplate: Template = {
      name: templateNameRef.current?.value || "",
      text: templateTextRef.current?.value || "",
    };
    onSubmit(newTemplate);
  }, [templateNameRef, templateTextRef, onSubmit]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>フォームを入力してください</DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <Field>
            <FieldLabel htmlFor="template-name">テンプレート名</FieldLabel>
            <Input
              id="template-name"
              ref={templateNameRef}
              defaultValue={template?.name}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="template-text">テンプレート文</FieldLabel>
            <Textarea
              id="template-text"
              ref={templateTextRef}
              defaultValue={template?.text}
            />
          </Field>
        </div>
        <DialogFooter>
          <div className="grid grid-cols-2 gap-2">
            <DialogClose asChild>
              <Button variant="outline">閉じる</Button>
            </DialogClose>
            {type === "create" && <Button onClick={handleSubmit}>追加</Button>}
            {type === "edit" && <Button onClick={handleSubmit}>編集</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
