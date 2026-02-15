import { TranslateService } from '@ngx-translate/core';

export const getLocaleText = (translate: TranslateService) => ({
  // filters
  filterOoo: translate.instant('AG_GRID.filterOoo'),
  andCondition: translate.instant('AG_GRID.andCondition'),
  orCondition: translate.instant('AG_GRID.orCondition'),
  contains: translate.instant('AG_GRID.contains'),
  notContains: translate.instant('AG_GRID.notContains'),
  equals: translate.instant('AG_GRID.equals'),
  notEqual: translate.instant('AG_GRID.notEqual'),
  startsWith: translate.instant('AG_GRID.startsWith'),
  endsWith: translate.instant('AG_GRID.endsWith'),
  blank: translate.instant('AG_GRID.blank'),
  notBlank: translate.instant('AG_GRID.notBlank'),
  // table pagination
  page: translate.instant('AG_GRID.page'),
  to: translate.instant('AG_GRID.to'),
  of: translate.instant('AG_GRID.of'),
  pageSizeSelectorLabel: translate.instant('AG_GRID.pageSizeSelectorLabel'),
  noRowsToShow: translate.instant('AG_GRID.noRowsToShow'),
});
