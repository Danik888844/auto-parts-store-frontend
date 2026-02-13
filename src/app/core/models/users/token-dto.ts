import { BaseDto } from "../base-dto";
import { UserDto } from "./user-dto";

export class TokenDto extends BaseDto {
    [x: string]: any;
    value?: string;
    expirationDate?: string;
    user?: UserDto
}