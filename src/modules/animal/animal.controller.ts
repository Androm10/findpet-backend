import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@ApiTags('animal')
@Controller('animal')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.animalService.get(id);
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get()
  getAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.animalService.getAll(limit, page);
  }

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.update(id, updateAnimalDto);
  }

  @Put(':id/favorite')
  makeFavorite(@Param('id') id: number, @Req() req) {
    return this.animalService.makeFavorite(id, req.user.id);
  }

  @Delete('id')
  delete(@Param('id') id: number) {
    return this.animalService.delete(id);
  }
}
