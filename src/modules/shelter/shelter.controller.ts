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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterService } from './shelter.service';

@ApiTags('shelter')
@Controller('shelter')
export class ShelterController {
  constructor(private shelterService: ShelterService) {}

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.shelterService.get(id);
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get()
  getAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.shelterService.getAll(limit, page);
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
