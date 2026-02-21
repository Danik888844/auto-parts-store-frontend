/**
 * Query-параметры GET api/Report/top-products
 * OrderBy: 0 — по количеству, 1 — по выручке
 */
export interface TopProductsFilterParams {
  DateFrom?: string | null;
  DateTo?: string | null;
  CategoryId?: string | null;
  ManufacturerId?: string | null;
  OrderBy?: number; // 0 = by quantity, 1 = by revenue
}

export interface TopProductsChartItem {
  x: string;
  y: number;
}

export interface TopProductsTableRow {
  sku: string;
  name: string;
  qty: number;
  revenue: number;
}

export interface TopProductsResponse {
  chartData: TopProductsChartItem[];
  table: TopProductsTableRow[];
}
