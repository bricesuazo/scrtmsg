const LoadingMessage = ({ isOwned }: { isOwned: boolean }) => {
  return (
    <div
      className={`rounded border p-4 dark:border-slate-800 ${isOwned && "p-2"}`}
    >
      <div className="flex items-center justify-between gap-x-2">
        <div className="mt-2 flex-1">
          <div className="h-4 w-full animate-pulse bg-slate-300 dark:bg-slate-700 sm:w-64" />
          <div className="my-1 h-4 w-[calc(100%-8rem)] animate-pulse bg-slate-300 dark:bg-slate-700 sm:hidden" />

          <div className="flex items-center gap-x-1">
            <div className="h-3 w-16 animate-pulse bg-slate-300 dark:bg-slate-700" />
            <p className="pointer-events-none select-none text-slate-500 dark:text-slate-600">
              ·
            </p>
            <div className="h-3 w-24 animate-pulse bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
        {isOwned && (
          <div className="h-8 w-8 rounded bg-slate-300 dark:bg-slate-700" />
        )}
      </div>

      {[...Array(1)].map((_, index) => {
        return (
          <div key={index} className={`px-4 py-2 pt-4 ${isOwned && "sm:mt-1"}`}>
            <div className="flex items-center justify-between gap-x-2">
              <div className="flex-1">
                <div className="h-4 w-full animate-pulse bg-slate-300 dark:bg-slate-700 sm:w-72" />
                <div className="my-1 h-4 w-[calc(100%-8rem)] animate-pulse bg-slate-300 dark:bg-slate-700 sm:hidden" />

                <div className="flex items-center gap-x-1">
                  <div className="h-3 w-16 animate-pulse bg-slate-300 dark:bg-slate-700" />

                  <p className="pointer-events-none select-none text-slate-500 dark:text-slate-600">
                    ·
                  </p>
                  <div className="h-3 w-24 animate-pulse bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
              {isOwned && (
                <div className="h-8 w-8 rounded bg-slate-300 dark:bg-slate-700" />
              )}
            </div>
          </div>
        );
      })}
      {isOwned && (
        <div className="mt-2 flex items-center justify-between gap-x-2">
          <div className="h-9 flex-1 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <div className="h-9 w-9 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
        </div>
      )}
    </div>
  );
};

export default LoadingMessage;
