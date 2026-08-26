import type { ComponentProps } from 'react';
import Input from './Input';

export function Form({ children, onSubmit }: ComponentProps<'form'>) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
Form.Input = Input;
Form.SubmitButton = SubmitButton;

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
