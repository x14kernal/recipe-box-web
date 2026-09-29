type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2 pb-6">
      {eyebrow && <p className="text-primary text-sm font-medium">{eyebrow}</p>}

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>

      {description && <p className="text-muted-foreground max-w-2xl">{description}</p>}
    </div>
  );
}
