import { BaseDto } from "../base-dto";

export class SupplierDto extends BaseDto {
    name: string = "";
    phone: string | null = null;
    email: string | null = null;
    address: string | null = null;
}
