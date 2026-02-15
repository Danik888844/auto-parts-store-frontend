import { PaginationReturnDto } from './pagination-return-dto';
import { ResponseModel } from './response.model';

export interface ListResponseModel<T> extends ResponseModel {
  items: T[];
  pagination: PaginationReturnDto;
}
