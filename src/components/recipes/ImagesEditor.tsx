import { type Dispatch, type SetStateAction } from 'react';
import { Plus, X } from 'lucide-react';

import type { NewRecipeImage } from '../../contracts/recipe/image';
import type { RecipeForm } from '../../contracts/recipe';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

type ImagesEditorProps = {
  recipeImages: NewRecipeImage[];
  onChange: Dispatch<SetStateAction<RecipeForm>>;
  errors: Record<string, string>;
  onError: Dispatch<SetStateAction<FormErrors>>;
};

export default function ImagesEditor({ recipeImages, onChange, errors, onError }: ImagesEditorProps) {
  function updateImageField(index: number, value: string) {
    onChange((prev) => ({
      ...prev,
      images: prev.images.map((image, idx) => {
        if (idx !== index) return image;

        return {
          imageUrl: value,
        };
      }),
    }));
  }

  function addNewEmptyImage() {
    onChange((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          imageUrl: '',
        },
      ],
    }));
  }

  function removeImage(index: number) {
    onChange((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    onError((prev) => {
      const images = Object.fromEntries(
        Object.entries(prev.images)
          .filter(([key]) => key !== String(index))
          .map(([_, value], i) => [i, value])
      );

      return {
        ...prev,
        images,
      };
    });
  }

  return (
    <Card className="border-border/60 bg-muted/30 shadow-sm rounded-7xl">
      <CardHeader>
        <CardTitle>Images</CardTitle>

        <p className="text-sm text-muted-foreground">Add images that showcase your recipe.</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {recipeImages.length > 0 && (
          <div className="space-y-3">
            {recipeImages.map((image, index) => (
              <ImageInput
                key={index}
                index={index}
                recipeImage={image}
                error={errors[index]}
                onUpdate={updateImageField}
                onRemove={removeImage}
              />
            ))}
          </div>
        )}

        <Button type="button" variant="outline" onClick={addNewEmptyImage}>
          <Plus />
          Add image
        </Button>
      </CardContent>
    </Card>
  );
}

type ImageInputProps = {
  index: number;
  recipeImage: NewRecipeImage;
  error?: string;
  onUpdate(index: number, value: string): void;
  onRemove: (index: number) => void;
};

function ImageInput({ index, recipeImage, error, onUpdate, onRemove }: ImageInputProps) {
  return (
    <div className="relative rounded-5xl border border-border/50 p-4 pr-12 transition-colors hover:bg-muted/50 hover:shadow-sm">
      <div className="space-y-2">
        <Label htmlFor={`image-${index}`}>Image {index + 1}</Label>

        <Input
          id={`image-${index}`}
          name={`images[${index}][imageUrl]`}
          type="url"
          placeholder="https://example.com/image.jpg"
          value={recipeImage.imageUrl}
          onChange={(event) => onUpdate(index, event.target.value)}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {index > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(index)}
          aria-label={`Remove image ${index + 1}`}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
