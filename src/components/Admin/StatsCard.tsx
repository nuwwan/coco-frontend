/**
 * StatsCard Component
 * Displays a single statistic with optional trend indicator
 */

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  valueColor?: string;
}

const StatsCard = ({ title, value, icon, trend, valueColor = 'text-white' }: StatsCardProps) => {
  return (
    <div className="card bg-slate-800/50 backdrop-blur border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;

