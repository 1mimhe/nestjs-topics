import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder() // For more complex queries
      // .select('*')
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      // left hand side 'make' => 'make' column should equal to some value => that is right hand side 'make'
      // the value of 'make' come from the object.
      .andWhere('model = :model', { model }) // If we need to add another condition.]
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC') // Order by mileage difference (absolute value) in descending order
      .setParameters({ mileage }) // // Bind the mileage parameter (Because we can't pass params to orderBy)
      .limit(3)
      // .getRawMany(); // Execute query and return raw unprocessed results (not entity instances)
      .getRawOne();
  }

  createReport(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo
      .findOneOrFail({
        where: { id },
      })
      .catch((error: Error) => {
        if (error instanceof EntityNotFoundError)
          throw new NotFoundException('Report with the given id not found.');
        throw error;
      });

    report.approved = approved;
    return this.repo.save(report);
  }
}
