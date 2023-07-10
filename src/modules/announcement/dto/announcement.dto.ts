import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class AnnouncementDTO {
  @ApiProperty()
  readonly id?: number;

  readonly value?: string;

  readonly show?: boolean;
}

export class CreateAnnouncementDTO extends PickType(AnnouncementDTO, [
  'value',
] as const) {}
export class ToggleAnnouncementDTO extends PickType(AnnouncementDTO, [
  'show',
] as const) {}

export class UpdateAnnouncementDTO extends OmitType(AnnouncementDTO, [
  'id',
] as const) {}
