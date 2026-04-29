export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
      {children}
    </div>
  );
}
