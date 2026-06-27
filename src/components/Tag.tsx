interface TagProps {
  variant: 'success' | 'destructive' | 'info';
  children: React.ReactNode;
}

const variantStyles = {
  success: 'bg-success/10 text-success border-success/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
};

export function Tag({ variant, children }: TagProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold border ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
