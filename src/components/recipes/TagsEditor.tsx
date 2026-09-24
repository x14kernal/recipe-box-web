import { type Dispatch, type SetStateAction, useState } from 'react';
import { Plus, X } from 'lucide-react';

import type { Tag, RecipeTagInput } from '../../contracts/recipe/tag';
import type { RecipeForm } from '../../contracts/recipe';

import { useTags } from '../../hooks/useTags';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';

type FormErrors = {
  ingredients: Record<string, Record<string, string>>;
  images: Record<string, string>;
  steps: Record<string, Record<string, string>>;
  tags: Record<string, string>;
  title: string;
  visibility: string;
  servingSize: string;
};

type TagsEditorProps = {
  recipeTags: RecipeTagInput[];
  onChange: Dispatch<SetStateAction<RecipeForm>>;
  errors: Record<string, string>;
  onError: Dispatch<SetStateAction<FormErrors>>;
};

export default function TagsEditor({ recipeTags, onChange, errors, onError }: TagsEditorProps) {
  const { tagsList, loading } = useTags();

  function selectTag(index: number, value: { id: string } | { name: string }) {
    onChange((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, idx) => {
        if (idx !== index) return tag;

        if ('id' in value) return { id: value.id };

        return { name: value.name };
      }),
    }));
  }

  function addNewEmptyTag() {
    onChange((prev) => ({ ...prev, tags: [...prev.tags, { name: '' }] }));
  }

  function removeTag(index: number) {
    onChange((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));

    onError((prev) => {
      const tags = Object.fromEntries(
        Object.entries(prev.tags)
          .filter(([key]) => key !== String(index))
          .map(([_, value], i) => [i, value])
      );

      return {
        ...prev,
        tags,
      };
    });
  }

  return (
    <Card className="border-border/60 bg-muted/30 shadow-sm rounded-7xl">
      <CardHeader>
        <CardTitle>Tags</CardTitle>

        <p className="text-sm text-muted-foreground">Add tags to help categorize and find your recipe.</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipeTags.map((tag, index) => (
            <TagInput
              key={index}
              index={index}
              recipeTag={tag}
              recipeTags={recipeTags}
              tagsList={tagsList}
              isTagsListLoading={loading}
              onSelect={selectTag}
              onRemove={removeTag}
              error={errors[index]}
            />
          ))}
        </div>

        <Button type="button" variant="outline" onClick={addNewEmptyTag}>
          <Plus />
          Add tag
        </Button>
      </CardContent>
    </Card>
  );
}

type TagInputProps = {
  index: number;
  recipeTag: RecipeTagInput;
  onSelect(index: number, value: { id: string } | { name: string }): void;
  onRemove: (index: number) => void;
  tagsList: Tag[];
  isTagsListLoading: boolean;
  recipeTags: RecipeTagInput[];
  error?: string;
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
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const availableTags = tagsList.filter((tag) => {
    return !recipeTags.some(
      (selectedTag, selectedIndex) => selectedIndex !== index && 'id' in selectedTag && selectedTag.id === tag.id
    );
  });

  const selectedName =
    'name' in recipeTag ? recipeTag.name : (tagsList.find((tag) => tag.id === recipeTag.id)?.name ?? '');

  const search = inputValue.trim().toLowerCase();

  const filteredTags = search ? availableTags.filter((tag) => tag.name.toLowerCase().includes(search)) : availableTags;

  const canCreate = search.length > 0 && !availableTags.some((tag) => tag.name.toLowerCase() === search);

  function handleValueChange(value: string | null) {
    if (!value) return;

    const existingTag = tagsList.find((tag) => tag.id === value);

    if (existingTag) {
      onSelect(index, { id: existingTag.id });
      setInputValue(existingTag.name);
    } else {
      onSelect(index, { name: value });
      setInputValue(value);
    }

    setOpen(false);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  return (
    <div className="relative pr-8">
      <div className="space-y-2">
        <Label htmlFor={`tag-${index}`}>Tag {index + 1}</Label>

        <Combobox
          open={open}
          onOpenChange={setOpen}
          value={'id' in recipeTag ? recipeTag.id : recipeTag.name}
          onValueChange={handleValueChange}
        >
          <ComboboxInput
            id={`tag-${index}`}
            name={`tags[${index}][tag]`}
            placeholder="Select or create a tag"
            value={inputValue || selectedName}
            onChange={handleInputChange}
            showClear
          />

          <ComboboxContent>
            <ComboboxList>
              {isTagsListLoading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Loading tags...</div>
              ) : (
                <>
                  {filteredTags.map((tag) => (
                    <ComboboxItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </ComboboxItem>
                  ))}

                  {canCreate && (
                    <ComboboxItem value={search}>
                      <Plus className="size-4" />
                      Create "{inputValue.trim()}"
                    </ComboboxItem>
                  )}

                  {!canCreate && filteredTags.length === 0 && <ComboboxEmpty>No tags found.</ComboboxEmpty>}
                </>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {index > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-7 size-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
          aria-label={`Remove tag ${index + 1}`}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
