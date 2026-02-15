export class PaginationQueryDto {
    search?: string;
    viewSize: number = 1;
    pageNumber: number = 20;
}