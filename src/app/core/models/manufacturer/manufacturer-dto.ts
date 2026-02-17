import { BaseDto } from "../base-dto";

export class ManufacturerDto extends BaseDto {
    name: string = "";
    country: string | null = null;
}
