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

export interface PercentagePoint {
  label: string
  percentage: number
  class: string
}

export const byAge: PercentagePoint[] = [
  {class: 'low', label: 'unter 35', percentage: 27},
  {class: 'mid', label: '35 - 60', percentage: 33},
  {class: 'high', label: 'über 60', percentage: 40}
]

export const byCitySize: PercentagePoint[] = [
  {class: 'low', label: 'kleinere\nGemeinden', percentage: 34},
  {class: 'mid', label: 'Großstädte', percentage: 53},
]

export interface HistoricalDetail {
  label: string
  value: number
}

export const historicalDetails: HistoricalDetail[] = [
  {label: 'Gesamt', value: 18},
  {label: 'Einpersonenhaushalte', value: 41},
  {label: '5+ Personenhaushalte', value: -19},
]

