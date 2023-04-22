import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    //transforma string a numero
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    //transforma string a numero
    @Type(() => Number)
    offset?: number;
}