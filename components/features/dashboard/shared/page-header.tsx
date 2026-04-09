interface Props {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      )}
    </div>
  );
}
