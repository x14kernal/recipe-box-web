import { type Dispatch, type SetStateAction } from 'react';
import Input from '../ui/Input';
import type { FormCreateRecipe, Tag } from '../../types/recipe';

type Ps = {
  tags: Tag[];
  onChange: Dispatch<SetStateAction<FormCreateRecipe>>;
  errors: Record<string, string>;
  onError: Dispatch<
    React.SetStateAction<{
      ingredients: Record<string, Record<string, string>>;
      steps: Record<string, string>;
      tags: Record<string, string>;
      title: string;
    }>
  >;
};

export default function TagsEditor({ tags, onChange, errors, onError }: Ps) {
  function onAdd() {
    const tagPlacholder: Tag = {
      id: crypto.randomUUID(),
      name: '',
    };
    onChange((prev) => ({ ...prev, tags: [...prev.tags, tagPlacholder] }));
  }

  function onDelete(id: string) {
    onChange((prev) => {
      if (prev.tags.length === 1) {
        onError((prev) => ({ ...prev, tags: {} }));
        return {
          ...prev,
          tags: [
            {
              id: crypto.randomUUID(),
              name: '',
            },
          ],
        };
      }
      return { ...prev, tags: prev.tags.filter((item) => item.id !== id) };
    });
  }

  function onUpdate(id: string, name: string) {
    onChange((prev) => ({
      ...prev,
      tags: prev.tags.map((t) => {
        if (t.id === id) {
          return { ...t, name };
        }
        return t;
      }),
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-start justify-between gap-2">
            <div className="flex-1 flex flex-col gap-0.5">
              <Input
                label={`tag`}
                type="text"
                name={`tags-[${tag.id}]`}
                id={`tag-${tag.id}`}
                value={tag.name}
                onChange={(e) => {
                  onUpdate(tag.id, e.target.value);
                }}
              />
              {errors[tag.id] && errors[tag.id].length > 0 && (
                <p className="text-red-700 text-sm">{errors[tag.id]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDelete(tag.id)}
              className="flex items-center justify-center font-black w-6 h-6 border p-2 rounded-full cursor-pointer"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="border px-2 py-1 cursor-pointer"
      >
        +
      </button>
    </div>
  );
}
