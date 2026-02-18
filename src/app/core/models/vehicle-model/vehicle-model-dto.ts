import { BaseDto } from "../base-dto";
import { VehicleBrandDto } from "../vehicle-brand/vehicle-brand-dto";
import { VehicleDto } from "../vehicle/vehicle-dto";

export class VehicleModelDto extends BaseDto
{
    brandId: string = "";
    brand: VehicleBrandDto | null = null;

    name: string = "";
    vehicles?: VehicleDto[] | null = null;
}