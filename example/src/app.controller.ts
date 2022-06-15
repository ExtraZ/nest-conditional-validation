import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ErrorIf, UseGroupsIf } from 'nest-conditional-validation';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

  @ApiProperty({ type: 'array' })
  @ErrorIf(
    (arr1, key, obj) =>
      (void console.log(arr1, key, obj) && arr1.length !== obj.arr2.length) ||
      arr1.length !== obj.arr3.length,
    { message: 'Arr1 Error Message' },
  )
  arr1: number[];

  @ApiProperty({ type: 'array' })
  @ErrorIf(
    (arr2, key, obj) =>
      (void console.log(arr2, key, obj) && arr2.length !== obj.arr1.length) ||
      arr2.length !== obj.arr3.length,
    { message: 'Arr2 Error Message' },
  )
  arr2: number[];

  @ApiProperty({ type: 'array' })
  @ErrorIf(
    (arr3, key, obj) =>
      (void console.log(arr3, key, obj) && arr3.length !== obj.arr2.length) ||
      arr3.length !== obj.arr1.length,
    { message: 'Arr3 Error Message' },
  )
  arr3: number[];
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  example(@Body() dto: ExampleDTO): string {
    return this.appService.getHello();
  }
}
