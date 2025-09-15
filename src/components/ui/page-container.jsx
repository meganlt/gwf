export default function PageContainer({ children }) {
  return (
    <div className="min-w-sm max-w-[468px] mx-auto w-full px-4 sm:px-6">
      {children}
    </div>
  );
}