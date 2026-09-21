import type { ComponentProps } from 'react';

export default function Input({ id, label, className, name, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={id} className="capitalize">
        {label}
      </label>
      <input id={id} name={name} className={`border px-2 py-1 rounded ${className ?? ''}`} {...props} />
    </div>
  );
}
