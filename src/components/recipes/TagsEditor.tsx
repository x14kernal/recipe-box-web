import type { Tag, RecipeTagInput } from '../../contracts/recipe/tag';
import Combobox from '../ui/Combobox';
import { type Dispatch, type SetStateAction } from 'react';
import { useTags } from '../../hooks/useTags';
import type { RecipeForm } from '../../contracts/recipe';

type TagsEditorProps = {
  recipeTags: RecipeTagInput[];
  onChange: Dispatch<SetStateAction<RecipeForm>>;
  errors: Record<string, string>;
  onError: Dispatch<
    SetStateAction<{
      ingredients: Record<string, Record<string, string>>;
      images: Record<string, string>;
      steps: Record<string, Record<string, string>>;
      tags: Record<string, string>;
      title: string;
      visibility: string;
      servingSize: string;
    }>
  >;
};

export default function TagsEditor({ recipeTags, onChange, errors, onError }: TagsEditorProps) {
  const { tagsList, loading } = useTags();

  function selectTag(index: number, value: { id: string } | { name: string }) {
    onChange((prev) => ({
      ...prev,
      tags: prev.tags.map((t, idx) => {
        if (idx !== index) return t;
        if ('id' in value) return { id: value.id };
        return { name: value.name };
      }),
    }));
  }

  function addNewEmptyTag() {
    onChange((prev) => ({ ...prev, tags: [...prev.tags, { name: '' }] }));
  }

  function removeTag(idx: number) {
    onChange((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => idx !== i) }));
    onError((prev) => {
      const tags = Object.fromEntries(
        Object.entries(prev.tags)
          .filter(([key]) => key !== String(idx))
          .map(([_, value], i) => [i, value])
      );
      return { ...prev, tags };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 my-4">
        <p className="text-gray-600 text-xl">Tags List</p>

        <div className="grid grid-cols-4 gap-2">
          {recipeTags.map((ing, idx) => (
            <TagInput
              key={idx}
              index={idx}
              recipeTag={ing}
              recipeTags={recipeTags}
              tagsList={tagsList}
              isTagsListLoading={loading}
              onSelect={selectTag}
              onRemove={removeTag}
              error={errors[idx]}
            />
          ))}
        </div>
      </div>
      <button type="button" onClick={addNewEmptyTag} className="bg-gray-100 cursor-pointer p-1">
        Add Tag
      </button>
    </div>
  );
}

type TagInputProps = {
  index: number;
  recipeTag: RecipeTagInput;
  onSelect(index: number, value: { id: string } | { name: string }): void;
  onRemove: (idx: number) => void;
  tagsList: Tag[];
  isTagsListLoading: boolean;
  recipeTags: RecipeTagInput[];
  error: string;
};

function TagInput({
  index,
  recipeTag,
  tagsList,
  isTagsListLoading,
  recipeTags,
  error,
  onSelect,
  onRemove,
}: TagInputProps) {
  function handleTagChange(value: { id: string } | { name: string } | null) {
    if (!value) return;
    onSelect(index, value);
  }

  const availableTags = tagsList.filter((tag) => {
    return !recipeTags.some((ing, idx) => idx !== index && 'id' in ing && ing.id === tag.id);
  });

  return (
    <div className="relative">
      <div className="flex flex-col gap-1">
        <Combobox
          name={`tags[${index}][tag]`}
          label="tag"
          id={`tag-${index}`}
          items={availableTags}
          isItemsLoading={isTagsListLoading}
          onChange={handleTagChange}
          selectedValue={recipeTag}
        />
        {error && error.length > 0 && <p className="text-sm text-red-700">{error}</p>}
      </div>

      {index > 0 && (
        <button
          type="button"
          className="absolute right-4 top-0 border p-2 w-5 h-5 flex items-center justify-center text-xs rounded-full hover:bg-red-200 cursor-pointer border-red-400"
          onClick={() => onRemove(index)}
        >
          x
        </button>
      )}
    </div>
  );
}
