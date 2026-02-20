/**
 * Ответ GET /report/dashboard (или GET /dashboard)
 * salesByMonth: пары [дата в мс (number), сумма (number)]
 */
export interface DashboardDto {
  salesTodayCount: number;
  salesTodayTotal: number;
  incomeForWeek: number;
  stockPositionsCount: number;
  stockTotalQuantity: number;
  clientsCount: number;
  /** Продажи за текущий месяц: [timestamp_ms, sum][] */
  salesByMonth: number[][];
}
