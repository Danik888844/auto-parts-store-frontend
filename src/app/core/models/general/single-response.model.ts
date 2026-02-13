import { ResponseModel } from "./response.model";

export interface SingleResponeModel<T> extends ResponseModel {
    data: T
}