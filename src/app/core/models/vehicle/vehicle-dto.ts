import { BaseDto } from "../base-dto";
import { ProductCompatibilityDto } from '../product-compatibility/product-compatibility-dto';
import { VehicleModelDto } from "../vehicle-model/vehicle-model-dto";

export class VehicleDto extends BaseDto {
  modelId: string = '';
  model: VehicleModelDto | null = null;

  yearFrom: number = 0;
  yearTo: number = 0;

  generation: string | null = null;
  engine: string | null = null;
  bodyType: string | null = null;
  note: string | null = null;

  compatibilities?: ProductCompatibilityDto[] | null = null;
}