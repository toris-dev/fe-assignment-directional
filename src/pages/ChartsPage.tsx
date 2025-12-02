import { useState, useEffect } from "react";
import {
  getTopCoffeeBrands,
  getPopularSnackBrands,
  getWeeklyMoodTrend,
  getWeeklyWorkoutTrend,
  getCoffeeConsumption,
  getSnackImpact,
} from "../api/charts";
import { ERROR_MESSAGES } from "../constants";
import type {
  TopCoffeeBrands,
  PopularSnackBrands,
  WeeklyMoodTrend,
  WeeklyWorkoutTrend,
  CoffeeConsumption,
  SnackImpact,
  ApiError,
} from "../types";
import BarChart from "../components/charts/BarChart";
import DoughnutChart from "../components/charts/DoughnutChart";
import StackedBarChart from "../components/charts/StackedBarChart";
import StackedAreaChart from "../components/charts/StackedAreaChart";
import MultiLineChart from "../components/charts/MultiLineChart";
import "./ChartsPage.css";

/**
 * 데이터 시각화 페이지 컴포넌트
 * 모든 차트를 표시합니다.
 */
const ChartsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // 데이터 상태
  const [topCoffeeBrands, setTopCoffeeBrands] = useState<TopCoffeeBrands[]>([]);
  const [popularSnackBrands, setPopularSnackBrands] = useState<
    PopularSnackBrands[]
  >([]);
  const [weeklyMoodTrend, setWeeklyMoodTrend] = useState<WeeklyMoodTrend[]>([]);
  const [weeklyWorkoutTrend, setWeeklyWorkoutTrend] = useState<
    WeeklyWorkoutTrend[]
  >([]);
  const [coffeeConsumption, setCoffeeConsumption] = useState<
    CoffeeConsumption[]
  >([]);
  const [snackImpact, setSnackImpact] = useState<SnackImpact[]>([]);

  /**
   * 모든 차트 데이터 로드
   */
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          coffeeBrands,
          snackBrands,
          moodTrend,
          workoutTrend,
          coffeeData,
          snackData,
        ] = await Promise.all([
          getTopCoffeeBrands(),
          getPopularSnackBrands(),
          getWeeklyMoodTrend(),
          getWeeklyWorkoutTrend(),
          getCoffeeConsumption(),
          getSnackImpact(),
        ]);

        // 개발 모드에서만 로그 출력
        if (import.meta.env.DEV) {
          console.log("차트 데이터 로드 완료:", {
            coffeeBrands: coffeeBrands.length,
            snackBrands: snackBrands.length,
            moodTrend: moodTrend.length,
            workoutTrend: workoutTrend.length,
            coffeeData: coffeeData.length,
            snackData: snackData.length,
          });
        }

        setTopCoffeeBrands(coffeeBrands);
        setPopularSnackBrands(snackBrands);
        setWeeklyMoodTrend(moodTrend);
        setWeeklyWorkoutTrend(workoutTrend);
        setCoffeeConsumption(coffeeData);
        setSnackImpact(snackData);
      } catch (err) {
        const error = err as ApiError;
        if (import.meta.env.DEV) {
          console.error("차트 데이터 로드 실패:", err);
        }
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          ERROR_MESSAGES.CHART_LOAD_FAILED;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="charts-page">
        <div className="loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="charts-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="charts-page">
      <h1>데이터 시각화</h1>

      {/* Top Coffee Brands - 바 차트, 도넛 차트 */}
      <div className="chart-section">
        <h2>Top Coffee Brands</h2>
        <div className="chart-row">
          <div className="chart-item">
            <BarChart
              data={
                topCoffeeBrands as unknown as Array<{
                  [key: string]: string | number;
                }>
              }
              xAxisKey="brand"
              title="Top Coffee Brands - 바 차트"
            />
          </div>
          <div className="chart-item">
            <DoughnutChart
              data={topCoffeeBrands}
              title="Top Coffee Brands - 도넛 차트"
            />
          </div>
        </div>
      </div>

      {/* Popular Snack Brands - 바 차트, 도넛 차트 */}
      <div className="chart-section">
        <h2>Popular Snack Brands</h2>
        <div className="chart-row">
          <div className="chart-item">
            <BarChart
              data={
                popularSnackBrands as unknown as Array<{
                  [key: string]: string | number;
                }>
              }
              xAxisKey="name"
              title="Popular Snack Brands - 바 차트"
            />
          </div>
          <div className="chart-item">
            <DoughnutChart
              data={popularSnackBrands}
              title="Popular Snack Brands - 도넛 차트"
            />
          </div>
        </div>
      </div>

      {/* Weekly Mood Trend - 스택형 바 차트, 스택형 면적 차트 */}
      <div className="chart-section">
        <h2>Weekly Mood Trend</h2>
        <div className="chart-row">
          <div className="chart-item">
            <StackedBarChart
              data={weeklyMoodTrend}
              title="Weekly Mood Trend - 스택형 바 차트"
            />
          </div>
          <div className="chart-item">
            <StackedAreaChart
              data={weeklyMoodTrend}
              title="Weekly Mood Trend - 스택형 면적 차트"
            />
          </div>
        </div>
      </div>

      {/* Weekly Workout Trend - 스택형 바 차트, 스택형 면적 차트 */}
      <div className="chart-section">
        <h2>Weekly Workout Trend</h2>
        <div className="chart-row">
          <div className="chart-item">
            <StackedBarChart
              data={weeklyWorkoutTrend}
              title="Weekly Workout Trend - 스택형 바 차트"
            />
          </div>
          <div className="chart-item">
            <StackedAreaChart
              data={weeklyWorkoutTrend}
              title="Weekly Workout Trend - 스택형 면적 차트"
            />
          </div>
        </div>
      </div>

      {/* Coffee Consumption - 멀티라인 차트 */}
      <div className="chart-section">
        <h2>Coffee Consumption</h2>
        <MultiLineChart
          data={coffeeConsumption}
          xAxisKey="coffee"
          leftYAxisKey="bugs"
          rightYAxisKey="productivity"
          title="Coffee Consumption - 멀티라인 차트"
        />
      </div>

      {/* Snack Impact - 멀티라인 차트 */}
      <div className="chart-section">
        <h2>Snack Impact</h2>
        <MultiLineChart
          data={snackImpact}
          xAxisKey="snacks"
          leftYAxisKey="meetingMissed"
          rightYAxisKey="morale"
          title="Snack Impact - 멀티라인 차트"
        />
      </div>
    </div>
  );
};

export default ChartsPage;
