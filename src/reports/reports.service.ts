import { Report} from "./report.entity"
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from "src/users/user.entity";
import { GetEstimateDto } from "./dto/get-estimate.dto";

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ) {
            }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report)
    }

    crateEstimate(estimateDto: GetEstimateDto) {
        return this.repo.createQueryBuilder().select('AVG(price)', 'price')
                .where('make = :make', {make: estimateDto.make})
                .andWhere('model = :model', {model: estimateDto.model})
                .andWhere('lng = :lng BETWEEN -5 AND 5', {lng: estimateDto.lng})
                .andWhere('lat = :lat BETWEEN -5 AND 5', {lat: estimateDto.lat})
                .andWhere('year = :year BETWEEN -3 AND 3', {year: estimateDto.year})
                .andWhere('approved IS TRUE')
                .orderBy('ABS(mileage - :mileage)', 'DESC')
                // orderByを使用した場合、2つ目の引数は mileage を使用できないので setParameters で渡す
                .setParameters({milage: estimateDto.mileage})
                .limit(3)
                .getRawMany()
    }

    async  changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) } });
        if(!report) {
            throw new NotFoundException('report not found')
        }

        report.approved = approved;
        return this.repo.save(report);
    }
}
