import { BaseDto } from "../base-dto";
import { VehicleModelDto } from "../vehicle-model/vehicle-model-dto";

export class VehicleBrandDto extends BaseDto
{
    name: string = "";

    models?: VehicleModelDto[] | null = null;
}