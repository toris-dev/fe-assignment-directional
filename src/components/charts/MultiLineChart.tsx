import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CoffeeConsumption, SnackImpact } from "../../types";
import "./charts.css";

/**
 * 원형 마커 컴포넌트 (왼쪽 Y축용)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CircleDot = (props: any) => {
  const { cx, cy, fill } = props;
  return <circle cx={cx} cy={cy} r={5} fill={fill} />;
};

/**
 * 사각형 마커 컴포넌트 (오른쪽 Y축용)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SquareDot = (props: any) => {
  const { cx, cy, fill } = props;
  return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill={fill} />;
};

interface MultiLineChartProps {
  data: CoffeeConsumption[] | SnackImpact[];
  xAxisKey: "coffee" | "snacks";
  leftYAxisKey: "bugs" | "meetingMissed";
  rightYAxisKey: "productivity" | "morale";
  colors?: string[];
  title?: string;
}

/**
 * 멀티라인 차트 컴포넌트
 * - 왼쪽 Y축: 버그 수 또는 회의불참 (실선, 원형 마커)
 * - 오른쪽 Y축: 생산성 점수 또는 사기 (점선, 사각형 마커)
 * - 범례에서 색상 변경 및 데이터 보이기/숨기기 기능 제공
 */
const MultiLineChart = ({
  data,
  xAxisKey,
  leftYAxisKey,
  rightYAxisKey,
  colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a"],
  title,
}: MultiLineChartProps) => {
  // 데이터가 배열인지 확인 (useMemo로 최적화)
  const dataArray = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const [lineColors, setLineColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    // 팀별로 색상 할당
    const dataArr = Array.isArray(data) ? data : [];
    const teams = Array.from(new Set(dataArr.map((item) => item.team)));
    teams.forEach((team, index) => {
      initial[`${team}-${leftYAxisKey}`] = colors[index % colors.length];
      initial[`${team}-${rightYAxisKey}`] = colors[index % colors.length];
    });
    return initial;
  });

  /**
   * 팀별 데이터 변환
   * 각 팀에 대해 두 개의 라인(실선, 점선) 생성
   */
  const chartData = useMemo(() => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return [];
    }

    const teams = Array.from(new Set(dataArray.map((item) => item.team)));
    const xValues = Array.from(
      new Set(
        dataArray.map((item) => {
          if (xAxisKey === "coffee" && "coffee" in item) {
            return item.coffee;
          } else if (xAxisKey === "snacks" && "snacks" in item) {
            return item.snacks;
          }
          return 0;
        })
      )
    ).sort((a, b) => a - b);

    return xValues.map((xValue) => {
      const result: Record<string, string | number> = {
        [xAxisKey]: xValue,
      };

      teams.forEach((team) => {
        const item = dataArray.find((d) => {
          if (xAxisKey === "coffee" && "coffee" in d) {
            return d.team === team && d.coffee === xValue;
          } else if (xAxisKey === "snacks" && "snacks" in d) {
            return d.team === team && d.snacks === xValue;
          }
          return false;
        });
        if (item) {
          if (
            xAxisKey === "coffee" &&
            "bugs" in item &&
            "productivity" in item
          ) {
            result[`${team}-${leftYAxisKey}`] = item.bugs;
            result[`${team}-${rightYAxisKey}`] = item.productivity;
          } else if (
            xAxisKey === "snacks" &&
            "meetingMissed" in item &&
            "morale" in item
          ) {
            result[`${team}-${leftYAxisKey}`] = item.meetingMissed;
            result[`${team}-${rightYAxisKey}`] = item.morale;
          }
        }
      });

      return result;
    });
  }, [dataArray, xAxisKey, leftYAxisKey, rightYAxisKey]);

  /**
   * 라인 가시성 토글
   */
  const toggleLine = (lineKey: string) => {
    setHiddenLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineKey)) {
        next.delete(lineKey);
      } else {
        next.add(lineKey);
      }
      return next;
    });
  };

  /**
   * 라인 색상 변경
   */
  const changeColor = (lineKey: string, color: string) => {
    setLineColors((prev) => ({
      ...prev,
      [lineKey]: color,
    }));
  };

  // 팀 목록
  const teams = useMemo(() => {
    return Array.from(new Set(dataArray.map((item) => item.team)));
  }, [dataArray]);

  /**
   * 커스텀 툴팁 컴포넌트
   * 호버된 라인의 포인트에 해당하는 X축 값과 해당 팀의 데이터만 표시
   * 커피 잔수(또는 스낵 수), 버그 수(또는 회의불참), 생산성 점수(또는 사기)를 함께 표시
   */
  const TooltipWithProps = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ({ active, payload, label }: any) => {
      if (!active || !payload || payload.length === 0) return null;

      // 호버된 라인의 팀 정보 추출
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hoveredPayload = payload[0] as any;
      const lineKey = hoveredPayload.dataKey as string;
      const team = lineKey.split("-")[0];

      // 해당 팀의 모든 데이터 필터링
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const teamData = payload.filter((p: any) => p.dataKey?.startsWith(team));

      // X축 값 (커피 잔수 또는 스낵 수)
      const xValue = label;
      const xLabel = xAxisKey === "coffee" ? "커피 잔수" : "스낵 수";

      // 팀의 데이터에서 값 추출
      let leftValue: number | null = null;
      let rightValue: number | null = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      teamData.forEach((entry: any) => {
        if (entry.dataKey?.includes(leftYAxisKey)) {
          leftValue = entry.value;
        }
        if (entry.dataKey?.includes(rightYAxisKey)) {
          rightValue = entry.value;
        }
      });

      // 색상 찾기 헬퍼 함수
      const findColor = (key: string): string => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = teamData.find((e: any) => e.dataKey?.includes(key));
        return found?.color || "#333";
      };

      return (
        <div className="custom-tooltip">
          <p
            className="tooltip-label"
            style={{
              fontWeight: 700,
              marginBottom: "0.5rem",
              fontSize: "1rem",
            }}
          >
            {team} 팀
          </p>
          <p style={{ marginBottom: "0.25rem", color: "#4a5568" }}>
            <strong>{xLabel}:</strong> {xValue}
          </p>
          {leftValue !== null && (
            <p
              style={{
                color: findColor(leftYAxisKey),
                marginBottom: "0.25rem",
              }}
            >
              <strong>
                {leftYAxisKey === "bugs" ? "버그 수" : "회의불참"}:
              </strong>{" "}
              {leftValue}
            </p>
          )}
          {rightValue !== null && (
            <p
              style={{
                color: findColor(rightYAxisKey),
              }}
            >
              <strong>
                {rightYAxisKey === "productivity" ? "생산성 점수" : "사기"}:
              </strong>{" "}
              {rightValue}
            </p>
          )}
        </div>
      );
    };
  }, [xAxisKey, leftYAxisKey, rightYAxisKey]);

  // 데이터가 없으면 메시지 표시
  if (dataArray.length === 0 || teams.length === 0) {
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
        {teams.map((team, teamIndex) => (
          <div key={`team-${teamIndex}-${team}`} className="team-legend-group">
            <div className="team-label">{team} 팀</div>
            <div className="team-lines">
              <div
                key={`${team}-${leftYAxisKey}-legend`}
                className="legend-item"
              >
                <input
                  type="checkbox"
                  checked={!hiddenLines.has(`${team}-${leftYAxisKey}`)}
                  onChange={() => toggleLine(`${team}-${leftYAxisKey}`)}
                  className="legend-checkbox"
                />
                <input
                  type="color"
                  value={lineColors[`${team}-${leftYAxisKey}`] || colors[0]}
                  onChange={(e) =>
                    changeColor(`${team}-${leftYAxisKey}`, e.target.value)
                  }
                  className="legend-color"
                />
                <span className="legend-label">{leftYAxisKey} (실선)</span>
              </div>
              <div
                key={`${team}-${rightYAxisKey}-legend`}
                className="legend-item"
              >
                <input
                  type="checkbox"
                  checked={!hiddenLines.has(`${team}-${rightYAxisKey}`)}
                  onChange={() => toggleLine(`${team}-${rightYAxisKey}`)}
                  className="legend-checkbox"
                />
                <input
                  type="color"
                  value={lineColors[`${team}-${rightYAxisKey}`] || colors[0]}
                  onChange={(e) =>
                    changeColor(`${team}-${rightYAxisKey}`, e.target.value)
                  }
                  className="legend-color"
                />
                <span className="legend-label">{rightYAxisKey} (점선)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            label={{
              value: xAxisKey === "coffee" ? "커피 섭취량 (잔/일)" : "스낵 수",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: leftYAxisKey === "bugs" ? "버그 수" : "회의불참",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: rightYAxisKey === "productivity" ? "생산성 점수" : "사기",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip content={TooltipWithProps} />
          <Legend />
          {teams.map((team, teamIndex) => {
            const leftLineKey = `${team}-${leftYAxisKey}`;
            const rightLineKey = `${team}-${rightYAxisKey}`;
            const color =
              lineColors[leftLineKey] || colors[teamIndex % colors.length];

            return (
              <g key={`team-${teamIndex}-${team}`}>
                {/* 왼쪽 Y축 라인 (실선, 원형 마커) */}
                {!hiddenLines.has(leftLineKey) && (
                  <Line
                    key={leftLineKey}
                    yAxisId="left"
                    type="monotone"
                    dataKey={leftLineKey}
                    stroke={color}
                    strokeWidth={2}
                    name={`${team} - ${leftYAxisKey}`}
                    dot={<CircleDot fill={color} />}
                    activeDot={{ r: 6 }}
                  />
                )}
                {/* 오른쪽 Y축 라인 (점선, 사각형 마커) */}
                {!hiddenLines.has(rightLineKey) && (
                  <Line
                    key={rightLineKey}
                    yAxisId="right"
                    type="monotone"
                    dataKey={rightLineKey}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name={`${team} - ${rightYAxisKey}`}
                    dot={<SquareDot fill={color} />}
                    activeDot={{ r: 5 }}
                  />
                )}
              </g>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineChart;
