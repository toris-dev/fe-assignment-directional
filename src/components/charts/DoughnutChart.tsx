import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TopCoffeeBrands, PopularSnackBrands } from "../../types";
import "./charts.css";

interface DoughnutChartProps {
  data: TopCoffeeBrands[] | PopularSnackBrands[];
  colors?: string[];
  title?: string;
}

/**
 * 도넛 차트 컴포넌트
 * 범례에서 색상 변경 및 데이터 보이기/숨기기 기능 제공
 */
const DoughnutChart = ({
  data,
  colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a"],
  title,
}: DoughnutChartProps) => {
  // 데이터가 배열인지 확인
  const dataArray = Array.isArray(data) ? data : [];

  // TopCoffeeBrands인지 PopularSnackBrands인지 확인
  const isTopCoffeeBrands = dataArray.length > 0 && "brand" in dataArray[0];

  // 브랜드/이름 키와 값 키 추출
  const getBrandKey = (item: TopCoffeeBrands | PopularSnackBrands): string => {
    return isTopCoffeeBrands
      ? (item as TopCoffeeBrands).brand
      : (item as PopularSnackBrands).name;
  };

  const getValueKey = (): string => {
    return isTopCoffeeBrands ? "popularity" : "share";
  };

  const [hiddenBrands, setHiddenBrands] = useState<Set<string>>(new Set());
  const [brandColors, setBrandColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const brandKey = getBrandKey(item);
        initial[brandKey] = colors[index % colors.length];
      });
    }
    return initial;
  });

  /**
   * 브랜드의 가시성 토글
   */
  const toggleBrand = (brand: string) => {
    setHiddenBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }
      return next;
    });
  };

  /**
   * 브랜드의 색상 변경
   */
  const changeColor = (brand: string, color: string) => {
    setBrandColors((prev) => ({
      ...prev,
      [brand]: color,
    }));
  };

  // 숨겨지지 않은 데이터만 필터링
  const visibleData = dataArray.filter(
    (item) => !hiddenBrands.has(getBrandKey(item))
  );

  // 전체 합계 계산 (비율 계산용)
  const totalValue = useMemo(() => {
    return visibleData.reduce((sum, item) => {
      return (
        sum +
        (isTopCoffeeBrands
          ? (item as TopCoffeeBrands).popularity
          : (item as PopularSnackBrands).share)
      );
    }, 0);
  }, [visibleData, isTopCoffeeBrands]);

  // 커스텀 툴팁 컴포넌트 (useMemo로 메모이제이션)
  const CustomTooltip = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ({ active, payload }: any) => {
      if (!active || !payload || payload.length === 0) return null;

      const data = payload[0].payload;
      const brandKey = isTopCoffeeBrands ? data.brand : data.name;
      const value = isTopCoffeeBrands ? data.popularity : data.share;

      // 비율 계산: payload의 percent가 있으면 사용, 없으면 전체 합계로 계산
      let percent: number;
      if (payload[0].percent !== undefined && payload[0].percent !== null) {
        percent = payload[0].percent;
      } else if (totalValue > 0) {
        percent = value / totalValue;
      } else {
        percent = 0;
      }
      const percentText = (percent * 100).toFixed(1);

      return (
        <div className="custom-tooltip">
          <p
            style={{
              fontWeight: 700,
              marginBottom: "0.5rem",
              fontSize: "1rem",
            }}
          >
            {brandKey}
          </p>
          <p style={{ color: "#667eea" }}>
            <strong>비율:</strong> {percentText}%
          </p>
        </div>
      );
    };
  }, [isTopCoffeeBrands, totalValue]);

  // 데이터가 없으면 메시지 표시
  if (dataArray.length === 0) {
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
        {dataArray.map((item, index) => {
          const brandKey = getBrandKey(item);
          return (
            <div key={`legend-${brandKey}-${index}`} className="legend-item">
              <input
                type="checkbox"
                checked={!hiddenBrands.has(brandKey)}
                onChange={() => toggleBrand(brandKey)}
                className="legend-checkbox"
              />
              <input
                type="color"
                value={brandColors[brandKey] || colors[0]}
                onChange={(e) => changeColor(brandKey, e.target.value)}
                className="legend-color"
              />
              <span className="legend-label">{brandKey}</span>
            </div>
          );
        })}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={visibleData as any}
            cx="50%"
            cy="50%"
            labelLine={false}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={(entry: any) => {
              const brandKey = isTopCoffeeBrands ? entry.brand : entry.name;
              return `${brandKey}: ${((entry.percent || 0) * 100).toFixed(0)}%`;
            }}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey={getValueKey()}
          >
            {visibleData.map((entry, index) => {
              const brandKey = getBrandKey(entry);
              return (
                <Cell
                  key={`cell-${brandKey}-${index}`}
                  fill={brandColors[brandKey] || colors[index % colors.length]}
                />
              );
            })}
          </Pie>
          <Tooltip content={CustomTooltip} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
