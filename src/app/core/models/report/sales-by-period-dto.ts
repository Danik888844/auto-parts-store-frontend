/**
 * Query-параметры для GET api/Report/sales-by-period и .../export
 */
export interface SalesByPeriodFilterParams {
  DateFrom?: string | null;  // ISO date
  DateTo?: string | null;
  UserId?: string | null;
  PaymentType?: number | null;
  ReturnsMode?: string | null;  // e.g. Include, Exclude, OnlyReturns
  GroupBy?: string | null;     // e.g. Day, Week, Month
}

/**
 * Ответ GET api/Report/sales-by-period.
 * data — в формате SalesByMonth: [timestamp_ms, sum][]
 */
export interface SalesByPeriodResponse {
  summary?: Record<string, unknown>;
  data: number[][];
}
