import type { ComponentProps } from 'react';

export function Form({ children, onSubmit }: ComponentProps<'form'>) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
Form.Input = Input;
Form.SubmitButton = SubmitButton;

function Input({
  id,
  label,
  className,
  ...props
}: ComponentProps<'input'> & { label: string }) {
  return (
    <div className="w-full flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={`border px-2 py-1 rounded ${className ?? ''}`}
        {...props}
      />
    </div>
  );
}

function SubmitButton({
  children,
  className,
  isLoading,
  ...props
}: ComponentProps<'button'> & { isLoading: boolean }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`border rounded cursor-pointer py-2 bg-slate-950 text-slate-50 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-800 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
