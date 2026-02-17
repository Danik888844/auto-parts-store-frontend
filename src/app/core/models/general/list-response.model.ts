import { PaginationReturnDto } from './pagination-return-dto';
import { ResponseModel } from './response.model';

export interface ListWithPaginationResponseModel<T> extends ResponseModel {
  data: {
    items: T[];
    pagination: PaginationReturnDto;
  };
}

export interface ListResponseModel<T> extends ResponseModel {
  data: T[];
}