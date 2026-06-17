import { useRef } from "react";
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

type Props = {
  template: Template | null;
  open: boolean;
};

export const TemplateDialog = ({ template, open }: Props) => {
  const templateNameRef = useRef<HTMLInputElement>(null);
  const templateTextRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {};

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>テンプレート追加フォーム</DialogTitle>
          <DialogDescription>フォームを入力してください</DialogDescription>
        </DialogHeader>
        <div>
          <Field>
            <FieldLabel htmlFor="template-name">テンプレート名</FieldLabel>
            <Input id="template-name" ref={templateNameRef} />
          </Field>
          <Field>
            <FieldLabel htmlFor="template-text">テンプレート文</FieldLabel>
            <Textarea id="template-text" ref={templateTextRef} />
          </Field>
        </div>
        <DialogFooter>
          <div className="grid grid-cols-2 gap-2">
            <DialogClose asChild>
              <Button variant="outline">閉じる</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>追加</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
