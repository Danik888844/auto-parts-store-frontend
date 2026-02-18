import { BaseDto } from "../base-dto";
import { CategoryDto } from "../category/category-dto";
import { ManufacturerDto } from "../manufacturer/manufacturer-dto";

export class ProductDto extends BaseDto {
    Sku: string = "";
    name: string = "";

    categoryId: string | null = null;
    category: CategoryDto | null = null;

    manufacturerId: string | null = null;
    manufacturer: ManufacturerDto | null = null;

    purchasePrice: number = 0;
    price: number = 0;

    description: string | null = null;
    isActive: boolean = true;
}
