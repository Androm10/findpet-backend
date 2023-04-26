import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Controller('user')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get(':id')
  get(@Param('id') id: number) {
    return this.animalService.get(id);
  }

  @Get()
  getAll() {
    return this.animalService.getAll();
  }

  @Post()
  create(@Body() createUserDto: CreateAnimalDto) {
    return this.animalService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateAnimalDto) {
    return this.animalService.update(id, updateUserDto);
  }

  @Delete('id')
  delete(@Param('id') id: number) {
    return this.animalService.delete(id);
  }
}
