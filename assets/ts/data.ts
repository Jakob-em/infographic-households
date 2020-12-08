export interface HistoricalPoint {
  year: number
  averageHouseholdSize: number,
  singleHouseholdPercentage: number
}

export const historicalData: HistoricalPoint[] = [
  {year: 1970, averageHouseholdSize: 2.83, singleHouseholdPercentage: 0.25},
  {year: 1999, averageHouseholdSize: 2.24, singleHouseholdPercentage: 0.35},
  {year: 2019, averageHouseholdSize: 2.03, singleHouseholdPercentage: 0.42},
]

