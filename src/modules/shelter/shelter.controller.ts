import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterService } from './shelter.service';

@Controller('shelter')
export class ShelterController {
  constructor(private shelterService: ShelterService) {}

  @Get(':id')
  get(@Param('id') id: number) {
    return this.shelterService.get(id);
  }

  @Get()
  getAll() {
    return this.shelterService.getAll();
  }

  @Post()
  create(@Body() createUserDto: CreateShelterDto) {
    return this.shelterService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateShelterDto) {
    return this.shelterService.update(id, updateUserDto);
  }

  @Delete('id')
  delete(@Param('id') id: number) {
    return this.shelterService.delete(id);
  }
}
