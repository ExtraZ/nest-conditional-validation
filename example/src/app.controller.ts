import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { UseGroupsIf } from 'nest-conditional-validation';
import { ApiProperty } from '@nestjs/swagger';

export class ExampleDTO {
  @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'number' }] })
  @UseGroupsIf('aIsNumber', (a) => typeof a === 'number')
  @UseGroupsIf('aIsString', (a) => typeof a === 'string')
  @IsNumber(undefined, { groups: ['aIsNumber'] })
  @IsString({ groups: ['aIsString'] })
  @IsNotEmpty()
  a: string | number;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @Max(100, { groups: ['aIsNumber'] })
  @Min(50, { groups: ['aIsString'] })
  b: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  example(@Body() dto: ExampleDTO): string {
    return this.appService.getHello();
  }
}
