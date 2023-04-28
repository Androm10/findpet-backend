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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
    return this.shelterService.getAll({}, limit, page);
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get('getByCity/:id')
  getByCity(
    @Param('id') id: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.shelterService.getByCity(id, limit, page);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createShelterDto: CreateShelterDto) {
    return this.shelterService.create(createShelterDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateShelterDto: UpdateShelterDto) {
    return this.shelterService.update(id, updateShelterDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('id')
  delete(@Param('id') id: number) {
    return this.shelterService.delete(id);
  }
}
