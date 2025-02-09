import { ApiProperty } from '@nestjs/swagger';

export class UpdateMasterScheduleDto {
  @ApiProperty({
    example: [
      {
        day: new Date(),
        start: '12:00',
        end: '18:00',
        freeTime: ['13:00-14:00', '15:00-15:30'],
      },
    ],
  })
  workingDays: {
    day: Date;
    start: string;
    end: string;
    freeTime: string[];
    allowedRecordingTime: number[];
  }[];
}

export class GetFreeTimeDto {
  @ApiProperty({
    example: '2024.12.26',
    required: false
  })
  date?: string;

  @ApiProperty({
    required: false,
  })
  activeEventId: number;

  @ApiProperty({
    required: false,
  })
  salonBranchId: number;

  @ApiProperty({
    required: false,
  })
  salonId: number;

  @ApiProperty({
    example: ["1"],
    required: false,
  })
  servicesIdArr: string[];

}
