export default function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 h-20 border dark:border-gray-700 shadow-sm animate-pulse"
        />
      ))}
    </div>
  );
}
