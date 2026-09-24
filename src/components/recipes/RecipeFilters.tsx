import { useState } from 'react';
import { Form, useSearchParams, useSubmit } from 'react-router';
import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useIngredients } from '@/hooks/useIngredients';
import { useTags } from '@/hooks/useTags';

export default function RecipeFilters() {
  const [open, setOpen] = useState(false);

  const { ingredientsList } = useIngredients();
  const { tagsList } = useTags();

  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  const [ingredients, setIngredients] = useState(searchParams.get('ingredients')?.split(',') ?? []);

  const [tags, setTags] = useState(searchParams.get('tags')?.split(',') ?? []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const search = formData.get('search')?.toString().trim();

    if (search) {
      params.set('search', search);
    }

    if (ingredients.length) {
      params.set('ingredients', ingredients.join(','));
    }

    if (tags.length) {
      params.set('tags', tags.join(','));
    }

    submit(params, {
      method: 'get',
      action: '/recipes',
    });
    setOpen(false);
  }

  function clearFilters() {
    setIngredients([]);
    setTags([]);

    submit(null, {
      method: 'get',
      action: '/recipes',
    });
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-xs hover:bg-accent">
        <Filter className="size-4" />
        Filters
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter recipes</SheetTitle>
        </SheetHeader>

        <Form method="get" action="/recipes" onSubmit={handleSubmit} className="flex flex-col gap-6 px-4">
          <Input name="search" placeholder="Search recipes..." defaultValue={searchParams.get('search') ?? ''} />

          {/* Ingredients */}
          <Combobox
            multiple
            value={ingredients}
            onValueChange={setIngredients}
            items={ingredientsList.map((item) => item.name)}
          >
            <ComboboxChips>
              <ComboboxValue>
                {(values: string[]) => values.map((value) => <ComboboxChip key={value}>{value}</ComboboxChip>)}
              </ComboboxValue>

              <ComboboxChipsInput placeholder="Search ingredients..." />
            </ComboboxChips>

            <ComboboxContent className="w-[min(320px,calc(100vw-2rem))]">
              <ComboboxEmpty>No ingredient found.</ComboboxEmpty>

              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {/* Tags */}
          <Combobox multiple value={tags} onValueChange={setTags} items={tagsList.map((item) => item.slug)}>
            <ComboboxChips>
              <ComboboxValue>
                {(values: string[]) =>
                  values.map((value) => {
                    const tag = tagsList.find((tag) => tag.slug === value);

                    return <ComboboxChip key={value}>{tag?.name ?? value}</ComboboxChip>;
                  })
                }
              </ComboboxValue>

              <ComboboxChipsInput placeholder="Search tags..." />
            </ComboboxChips>

            <ComboboxContent className="w-[min(320px,calc(100vw-2rem))]">
              <ComboboxEmpty>No tag found.</ComboboxEmpty>

              <ComboboxList>
                {(item) => {
                  const tag = tagsList.find((tag) => tag.slug === item);

                  return (
                    <ComboboxItem key={item} value={item}>
                      {tag?.name ?? item}
                    </ComboboxItem>
                  );
                }}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <div className="flex gap-2">
            <Button type="submit">Apply filters</Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
