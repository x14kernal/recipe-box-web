import { type Dispatch, type SetStateAction } from 'react';
import type { NewRecipeImage } from '../../contracts/recipe/image';
import Input from '../ui/Input';
import type { RecipeForm } from '../../contracts/recipe';

type ImagesEditorProps = {
  recipeImages: NewRecipeImage[];
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

export default function ImagesEditor({ recipeImages, onChange, errors, onError }: ImagesEditorProps) {
  function updateImageField(index: number, value: string) {
    onChange((prev) => ({
      ...prev,
      images: prev.images.map((image, idx) => {
        if (idx !== index) return image;
        return { imageUrl: value };
      }),
    }));
  }

  function addNewEmptyImage() {
    onChange((prev) => ({ ...prev, images: [...prev.images, { imageUrl: '' }] }));
  }

  function removeImage(idx: number) {
    onChange((prev) => ({ ...prev, images: prev.images.filter((_, i) => idx !== i) }));
    onError((prev) => {
      const images = Object.fromEntries(
        Object.entries(prev.images)
          .filter(([key]) => key !== String(idx))
          .map(([_, value], i) => [i, value])
      );

      return { ...prev, images };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 my-4">
        <p className="text-gray-600 text-xl">Images List</p>

        {recipeImages.map((ing, idx) => (
          <ImageInput
            key={idx}
            index={idx}
            recipeImage={ing}
            error={errors[idx]}
            onUpdate={updateImageField}
            onRemove={removeImage}
          />
        ))}
      </div>
      <button type="button" onClick={addNewEmptyImage} className="bg-gray-100 cursor-pointer p-1">
        Add Image
      </button>
    </div>
  );
}

type ImageInputProps = {
  index: number;
  recipeImage: NewRecipeImage;
  error: string;
  onUpdate(index: number, value: string): void;
  onRemove: (idx: number) => void;
};

function ImageInput({ index, recipeImage, error, onUpdate, onRemove }: ImageInputProps) {
  const { imageUrl } = recipeImage;
  return (
    <div className="relative flex gap-2">
      <div className="flex flex-col gap-1">
        <Input
          label={`Link #${index + 1}`}
          type="text"
          name={`images[${index}][imageUrl]`}
          id={`description-${index}`}
          value={imageUrl}
          onChange={(e) => onUpdate(index, e.target.value)}
        />
        {error && error.length > 0 && <p className="text-sm text-red-700">{error}</p>}
      </div>

      {index > 0 && (
        <button
          type="button"
          className="absolute right-0 border p-2 w-5 h-5 flex items-center justify-center text-xs rounded-full hover:bg-red-200 cursor-pointer border-red-400"
          onClick={() => onRemove(index)}
        >
          x
        </button>
      )}
    </div>
  );
}
