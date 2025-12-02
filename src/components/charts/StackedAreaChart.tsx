import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeeklyMoodTrend, WeeklyWorkoutTrend } from '../../types';
import './charts.css';

interface StackedAreaChartProps {
  data: WeeklyMoodTrend[] | WeeklyWorkoutTrend[];
  colors?: string[];
  title?: string;
}

/**
 * 스택형 면적 차트 컴포넌트
 * 범례에서 색상 변경 및 데이터 보이기/숨기기 기능 제공
 */
const StackedAreaChart = ({ 
  data, 
  colors = ['#667eea', '#764ba2', '#f093fb'],
  title 
}: StackedAreaChartProps) => {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [dataColors, setDataColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (data.length > 0) {
      const keys = Object.keys(data[0]).filter((key) => key !== 'week');
      keys.forEach((key, index) => {
        initial[key] = colors[index % colors.length];
      });
    }
    return initial;
  });

  /**
   * 데이터 키의 가시성 토글
   */
  const toggleKey = (key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  /**
   * 데이터 키의 색상 변경
   */
  const changeColor = (key: string, color: string) => {
    setDataColors((prev) => ({
      ...prev,
      [key]: color,
    }));
  };

  // 데이터 키 목록 (week 제외)
  const dataKeys = data.length > 0 
    ? Object.keys(data[0]).filter((key) => key !== 'week')
    : [];

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      
      {/* 범례 컨트롤 */}
      <div className="legend-controls">
        {dataKeys.map((key) => (
          <div key={key} className="legend-item">
            <input
              type="checkbox"
              checked={!hiddenKeys.has(key)}
              onChange={() => toggleKey(key)}
              className="legend-checkbox"
            />
            <input
              type="color"
              value={dataColors[key] || colors[0]}
              onChange={(e) => changeColor(key, e.target.value)}
              className="legend-color"
            />
            <span className="legend-label">{key}</span>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="week" />
          <YAxis 
            label={{ value: '백분율 (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
          />
          <Legend />
          {dataKeys.map((key) => {
            if (hiddenKeys.has(key)) return null;
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={dataColors[key] || colors[0]}
                fill={dataColors[key] || colors[0]}
                hide={hiddenKeys.has(key)}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaChart;

