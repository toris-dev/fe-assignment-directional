import { useState } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./charts.css";

interface BarChartProps {
  data: Array<{ [key: string]: string | number }>;
  xAxisKey: string;
  colors?: string[];
  title?: string;
}

/**
 * 바 차트 컴포넌트
 * 범례에서 색상 변경 및 데이터 보이기/숨기기 기능 제공
 */
const BarChart = ({
  data,
  xAxisKey,
  colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
  title,
}: BarChartProps) => {
  const [hiddenDataKeys, setHiddenDataKeys] = useState<Set<string>>(new Set());
  const [dataColors, setDataColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    // 데이터에서 모든 키를 찾아 색상 할당
    if (data.length > 0) {
      Object.keys(data[0]).forEach((key, index) => {
        if (key !== xAxisKey) {
          initial[key] = colors[index % colors.length];
        }
      });
    }
    return initial;
  });

  /**
   * 데이터 키의 가시성 토글
   */
  const toggleDataKey = (key: string) => {
    setHiddenDataKeys((prev) => {
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

  // 표시할 데이터 키 목록 (xAxisKey 제외)
  const dataKeys =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== xAxisKey)
      : [];

  // 데이터가 없으면 메시지 표시
  if (data.length === 0 || dataKeys.length === 0) {
    return (
      <div className="chart-container">
        {title && <h3 className="chart-title">{title}</h3>}
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}

      {/* 범례 컨트롤 */}
      <div className="legend-controls">
        {dataKeys.map((key, index) => (
          <div key={`legend-${key}-${index}`} className="legend-item">
            <input
              type="checkbox"
              checked={!hiddenDataKeys.has(key)}
              onChange={() => toggleDataKey(key)}
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
        <RechartsBarChart data={data}>
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {dataKeys.map((key) => {
            if (hiddenDataKeys.has(key)) return null;
            return (
              <Bar
                key={key}
                dataKey={key}
                fill={dataColors[key] || colors[0]}
                hide={hiddenDataKeys.has(key)}
              />
            );
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
