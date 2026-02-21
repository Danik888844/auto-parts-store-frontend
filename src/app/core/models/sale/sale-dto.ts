import { BaseDto } from "../base-dto";
import { ClientDto } from "../client/client-dto";
import { UserDto } from "../users/user-dto";
import { PaymentType } from "./payment-type";
import { SaleItemDto, SaleItemFormDto } from "./sale-item-dto";
import { SaleStatus } from "./sale-status";


export class SaleDto extends BaseDto {
    soldAt: string = '';

    clientId: number | null = null;
    client: ClientDto | null = null;

    userId: string = '';
    user: UserDto | null = null;

    paymentType: PaymentType = PaymentType.Cash;
    status: SaleStatus = SaleStatus.Draft;
    total: number = 0;
    items: SaleItemDto[] = [];
}

export class SaleFormDto
{
    /** true — черновик (остатки не списываются), false — сразу завершённая продажа */
    createAsDraft?: boolean = false;
    clientId: number | null = null;
    paymentType: PaymentType = PaymentType.Cash;
    items: SaleItemFormDto[] = [];
}