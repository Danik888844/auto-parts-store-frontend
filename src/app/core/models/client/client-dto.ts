import { BaseDto } from "../base-dto";

export class ClientDto extends BaseDto {
    fullName: string = "";
    phone: string | null = null;
    email: string | null = null;
    notes: string | null = null;
}
