export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-10">
      {children}
    </div>
  );
}
