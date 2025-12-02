import apiClient from "./client";
import type {
  TopCoffeeBrands,
  PopularSnackBrands,
  WeeklyMoodTrend,
  WeeklyWorkoutTrend,
  CoffeeConsumption,
  SnackImpact,
} from "../types";

export const getTopCoffeeBrands = async (): Promise<TopCoffeeBrands[]> => {
  const response = await apiClient.get("/mock/top-coffee-brands");
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response.data?.items && Array.isArray(response.data.items)) {
    return response.data.items;
  }
  return [];
};

export const getPopularSnackBrands = async (): Promise<
  PopularSnackBrands[]
> => {
  const response = await apiClient.get("/mock/popular-snack-brands");
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response.data?.items && Array.isArray(response.data.items)) {
    return response.data.items;
  }
  return [];
};

export const getWeeklyMoodTrend = async (): Promise<WeeklyMoodTrend[]> => {
  const response = await apiClient.get("/mock/weekly-mood-trend");
  // API 응답 구조 확인 및 처리
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response.data?.items && Array.isArray(response.data.items)) {
    return response.data.items;
  }
  return [];
};

export const getWeeklyWorkoutTrend = async (): Promise<
  WeeklyWorkoutTrend[]
> => {
  const response = await apiClient.get("/mock/weekly-workout-trend");
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response.data?.items && Array.isArray(response.data.items)) {
    return response.data.items;
  }
  return [];
};

export const getCoffeeConsumption = async (): Promise<CoffeeConsumption[]> => {
  try {
    const response = await apiClient.get("/mock/coffee-consumption");

    if (response.data?.teams && Array.isArray(response.data.teams)) {
      const result: CoffeeConsumption[] = [];

      response.data.teams.forEach(
        (teamData: {
          team: string;
          series: Array<{ cups: number; bugs: number; productivity: number }>;
        }) => {
          if (teamData.series && Array.isArray(teamData.series)) {
            teamData.series.forEach((item) => {
              result.push({
                coffee: item.cups,
                team: teamData.team,
                bugs: item.bugs,
                productivity: item.productivity,
              });
            });
          }
        }
      );

      return result;
    }

    return [];
  } catch (error) {
    console.error("Coffee Consumption API 호출 실패:", error);
    return [];
  }
};

export const getSnackImpact = async (): Promise<SnackImpact[]> => {
  try {
    const response = await apiClient.get("/mock/snack-impact");

    // API 응답 구조: { departments: [...] }
    if (
      response.data?.departments &&
      Array.isArray(response.data.departments)
    ) {
      const result: SnackImpact[] = [];

      // 각 부서의 metrics 데이터를 평탄화
      response.data.departments.forEach(
        (deptData: {
          name: string;
          metrics: Array<{
            snacks: number;
            meetingsMissed: number;
            morale: number;
          }>;
        }) => {
          if (deptData.metrics && Array.isArray(deptData.metrics)) {
            deptData.metrics.forEach((item) => {
              result.push({
                snacks: item.snacks,
                team: deptData.name,
                meetingMissed: item.meetingsMissed,
                morale: item.morale,
              });
            });
          }
        }
      );

      return result;
    }

    return [];
  } catch (error) {
    console.error("Snack Impact API 호출 실패:", error);
    return [];
  }
};
