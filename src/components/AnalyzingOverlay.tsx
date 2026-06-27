export function AnalyzingOverlay({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${
        isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin-custom mx-auto" />
        <div className="mt-3 text-sm font-medium">Analyzing...</div>
      </div>
    </div>
  );
}
