import { Expose, Transform } from "class-transformer";

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  price: number;

  // Add a new property to outgoing response
  @Transform(({ obj }) => obj.user?.id) // @Transform => change something in outgoing response
  @Expose()
  userId: number;
}