export default function PublicLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
    </div>
  );
}
