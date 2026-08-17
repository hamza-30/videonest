function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border border-[#8132e5]/20 bg-[#8132e5]/5 shadow-[0_0_20px_rgba(129,50,229,0.12)]" />
        <div
          className="absolute h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-[#8132e5] border-r-[#8132e5]/80"
          role="status"
          aria-label="Loading"
        />
        <div className="absolute h-6 w-6 rounded-full bg-[#8132e5]/20 blur-md" />
      </div>
    </div>
  );
}

export default Loading;
