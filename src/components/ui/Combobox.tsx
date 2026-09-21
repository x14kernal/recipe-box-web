import { useEffect, useState } from 'react';
import Input from './Input';

type ComboboxItem = { id: string; name: string; image?: string | null };
type ComboboxValue = { id: string } | { name: string } | null;

type ComboboxProps = {
  id: string;
  label: string;
  name: string;
  items: ComboboxItem[];
  isItemsLoading: boolean;
  onChange: (value: ComboboxValue) => void;
  selectedValue?: { id: string } | { name: string };
};

export default function Combobox({ items, selectedValue, id, label, name, isItemsLoading, onChange }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');

  const trimmed = userInput.trim().toLowerCase();

  const displayItems = trimmed.length ? items.filter(({ name }) => name.toLowerCase().includes(trimmed)) : items;

  const showCreate = trimmed.length > 0 && displayItems.length === 0;

  useEffect(() => {
    if (!selectedValue) {
      setUserInput('');
      return;
    }

    if ('name' in selectedValue && selectedValue.name.length) {
      setUserInput(selectedValue.name);
      return;
    }

    if ('id' in selectedValue && selectedValue.id.length) {
      const item = items.find((item) => item.id === selectedValue.id);
      setUserInput(item?.name ?? '');
    }
  }, [selectedValue, items]);

  return (
    <div className="relative w-full max-w-75">
      <Input
        type="text"
        name={name}
        id={id}
        label={label}
        value={userInput}
        className="capitalize"
        placeholder={`Select ${label}`}
        onChange={(e) => setUserInput(e.target.value)}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <div className="absolute w-full flex flex-col items-start p-2 border mt-1 rounded-md space-y-2 max-h-75 overflow-y-auto bg-white z-10">
          {isItemsLoading && <p className="w-full text-left p-1 text-sm capitalize">Loading...</p>}

          {!isItemsLoading &&
            displayItems.map((item) => (
              <button
                className="cursor-pointer w-full text-left p-1 text-sm hover:bg-gray-200 transition-all ease-in-out capitalize"
                type="button"
                key={item.id}
                onClick={() => {
                  onChange({ id: item.id });
                  setUserInput(item.name);
                  setOpen(false);
                }}
              >
                {item.name}
              </button>
            ))}

          {showCreate && (
            <button
              type="button"
              className="cursor-pointer w-full text-left py-0.5  capitalize"
              onClick={() => {
                onChange({ name: userInput.trim() });
                setUserInput(userInput.trim());
                setOpen(false);
              }}
            >
              Create "{userInput.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
