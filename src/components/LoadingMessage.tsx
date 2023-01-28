const LoadingMessage = ({ isOwned }: { isOwned: boolean }) => {
  return (
    <div className="rounded border p-4 dark:border-slate-800">
      <div className="my-2 h-4 w-full animate-pulse bg-slate-300 dark:bg-slate-700 sm:mb-1 sm:w-64" />
      <div className="mt-2 h-4 w-[calc(100%-8rem)] animate-pulse bg-slate-300 dark:bg-slate-700 sm:hidden" />
      <div className="flex items-center gap-x-1">
        <div className="h-3 w-16 animate-pulse bg-slate-300 dark:bg-slate-700" />
        <p className="pointer-events-none select-none text-slate-500 dark:text-slate-600">
          ·
        </p>
        <div className="h-3 w-24 animate-pulse bg-slate-300 dark:bg-slate-700" />
      </div>

      {[...Array(1)].map((_, index) => {
        return (
          <div key={index} className="space-y-1 px-4 py-2">
            <div className="h-4 w-full animate-pulse bg-slate-300 dark:bg-slate-700" />
            <div className="h-4 w-[calc(100%-10rem)] animate-pulse bg-slate-300 dark:bg-slate-700 sm:hidden" />

            <div className="flex items-center gap-x-1">
              <div className="h-3 w-16 animate-pulse bg-slate-300 dark:bg-slate-700" />

              <p className="pointer-events-none select-none text-slate-500 dark:text-slate-600">
                ·
              </p>
              <div className="h-3 w-24 animate-pulse bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoadingMessage;
