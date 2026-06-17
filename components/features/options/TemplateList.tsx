import { Button } from "@/components/ui/button";
import type { Template } from "@/src/shared/storage/templates";
import { Pencil, Trash2 } from "lucide-react";

type TemplateListItemProps = {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
  // TODO: 並び順変更
} & React.HTMLAttributes<HTMLLIElement>;

const TemplateListItem = ({
  template,
  onEdit,
  onDelete,
}: TemplateListItemProps) => {
  return (
    <li className="grid grid-cols-[1fr_max-content] items-center rounded border p-1">
      <div>{template.name}</div>
      <div className="flex items-center gap-1">
        <Button size="icon-sm" onClick={() => onEdit(template)}>
          <Pencil />
        </Button>
        <Button size="icon-sm" onClick={() => onDelete(template)}>
          <Trash2 />
        </Button>
      </div>
    </li>
  );
};

type Props = {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (template: Template) => void;
};

export const TemplateList = ({ templates, onEdit, onDelete }: Props) => {
  return (
    <div>
      {!templates.length && <div>登録されたテンプレートはありません</div>}
      {!!templates.length && (
        <ul className="grid grid-cols-1 gap-1">
          {templates.map((template, index) => (
            <TemplateListItem
              key={index}
              template={template}
              onEdit={() => onEdit(template)}
              onDelete={() => onDelete(template)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
