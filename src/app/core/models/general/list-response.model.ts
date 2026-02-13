import { ResponseModel } from "./response.model";

export interface ListResponeModel<T> extends ResponseModel {
    data: T[]
}