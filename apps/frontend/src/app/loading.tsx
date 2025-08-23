export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-12 w-12 mx-auto rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 h-12 w-12 mx-auto rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Just a moment while we get things ready
          </p>
        </div>
      </div>
    </div>
  );
}
