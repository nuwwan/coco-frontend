/**
 * LineChartCard Component
 * Displays a line chart with monthly data in a styled card
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthlyData } from '../../utils/types';

interface LineChartCardProps {
  title: string;
  data: MonthlyData | undefined;
  color?: string;
  icon?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

// Transform MonthlyData (Record<string, number>) to chart-friendly array
const transformData = (data: MonthlyData | undefined) => {
  if (!data) return [];
  
  return Object.entries(data)
    .map(([dateKey, value]) => {
      // Parse date key format: "YYYY-M-D"
      const [year, month] = dateKey.split('-').map(Number);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        name: `${monthNames[month - 1]} ${year.toString().slice(-2)}`,
        value: value,
        sortKey: new Date(year, month - 1, 1).getTime(),
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);
};

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

const CustomTooltip = ({ 
  active, 
  payload,
  label,
  valuePrefix = '', 
  valueSuffix = '' 
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">
          {valuePrefix}{payload[0].value.toLocaleString()}{valueSuffix}
        </p>
      </div>
    );
  }
  return null;
};

const LineChartCard = ({ 
  title, 
  data, 
  color = '#10b981', 
  icon = '📊',
  valuePrefix = '',
  valueSuffix = '',
}: LineChartCardProps) => {
  const chartData = transformData(data);
  
  // Calculate total and trend
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const lastValue = chartData[chartData.length - 1]?.value || 0;
  const prevValue = chartData[chartData.length - 2]?.value || 0;
  const trend = prevValue > 0 ? ((lastValue - prevValue) / prevValue * 100).toFixed(1) : '0';
  const isPositive = Number(trend) >= 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
            <p className="text-white text-xl font-bold">
              {valuePrefix}{total.toLocaleString()}{valueSuffix}
            </p>
          </div>
        </div>
        {/* Trend Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(Number(trend))}%
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
              />
              <Tooltip 
                content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                dot={{ fill: color, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: color, stroke: '#1e293b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChartCard;

