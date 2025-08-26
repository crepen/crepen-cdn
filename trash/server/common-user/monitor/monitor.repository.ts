import { CrepenBaseRepository } from "@crepen-nest/lib/common/base.repository";
import { DatabaseService } from "@crepen-nest/module/config/database/database.config.service";
import { Injectable } from "@nestjs/common";
import { RepositoryOptions } from "src/interface/repo";
import { FileTrafficLoggerEntity } from "../../common/logger/entity/file-traffic-logger.default.entity";
import { CrepenCumulativeMonitorDto } from "./dto/cumulative.monitor.dto";

@Injectable()
export class CrepenUserMonitorRepository extends CrepenBaseRepository{
    constructor(
        private readonly databaseService: DatabaseService
    ) {
        super(databaseService)
    }




    getCumulativeData = async (targetUserUid: string , options? : RepositoryOptions) => {
        // return this.dataSource.getRepository(FileTrafficLoggerEntity)
        //     .createQueryBuilder('traffic')
        //     .select([
        //         `DATE_FORMAT(MAX(log.date), '%Y-%m-%d %H:00:00') AS hour_start_time`,
        //         `MAX(log.date) AS hour_end_time`, // 이 시간대 내에서 가장 마지막에 기록된 시간
        //         `SUM(log.traffic_size) AS hourly_traffic_size`,
        //     ])
        //     .where('1=1')
        //     // .andWhere('log.date >= :startDate', { startDate })
        //     .andWhere('log.access_user_uid = :accessUserUid', { accessUserUid: targetUserUid })
        //     .groupBy(`DATE_FORMAT(log.date, '%Y-%m-%d %H:00:00')`)
        //     .getRawMany()

        const dataSource = options?.manager ?? await this.databaseService.getDefault();

        const builder = dataSource
            .createQueryBuilder()

            .select(`CONVERT_TZ(DATE_ADD(DATE_FORMAT(hourly_summary.hour_end_time, '%Y-%m-%d %H:00:00'),INTERVAL 1 HOUR), @@session.time_zone, '+00:00')`, 'date')
            .addSelect(`SUM(hourly_summary.hourly_traffic_size) OVER (ORDER BY hourly_summary.hour_start_time ASC)`, 'traffic')

            .from((qb) => (
                qb
                    .select("DATE_FORMAT(`traffic`.`date`, '%Y-%m-%d %H:00:00')", 'hour_start_time')
                    .addSelect("MAX(`traffic`.`date`)", 'hour_end_time')
                    .addSelect("SUM(`traffic`.traffic_size)", 'hourly_traffic_size')
                    .from(FileTrafficLoggerEntity, 'traffic')
                    .where('1=1')
                    // .andWhere("`traffic`.`date` >= '2025-07-21 11:00:00.000'")
                    .andWhere("`traffic`.`access_user_uid` = :userUid", { userUid: targetUserUid })
                    .groupBy("DATE_FORMAT(`traffic`.`date`, '%Y-%m-%d %H:00:00')")

            ), 'hourly_summary')
            .orderBy("hour_end_time", "ASC");

        const result = await builder.getRawMany<{ date: string, traffic: string }>();

        return result.map(x=>new CrepenCumulativeMonitorDto(x.date , x.traffic))
    }
}