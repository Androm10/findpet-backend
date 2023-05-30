import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserRequest } from 'src/common/decorators/user.decorator';
import { UserFromRequest } from 'src/common/types/user-request';
import { Coords } from 'src/core/value-objects/coordinates.value-object';
import { IsWorkerGuard } from '../auth/guards/is-worker.guard';
import { AddShelterPhotosDto } from './dto/add-shelter-photos.dto';
import { AddWorkerDto } from './dto/add-worker.dto';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterService } from './shelter.service';

@ApiTags('shelter')
@Controller('shelter')
export class ShelterController {
  constructor(private shelterService: ShelterService) {}

  @NoAuth()
  @Get('getNearest')
  getNearest(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.shelterService.getNearest(
      new Coords({ latitude, longitude }),
      limit,
      page,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.shelterService.get(id);
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get(':id/workers')
  getWorkers(@Param('id') id: number) {
    return this.shelterService.getWorkers(id);
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
  create(
    @Body() createShelterDto: CreateShelterDto,
    @UserRequest() user: UserFromRequest,
  ) {
    return this.shelterService.create(createShelterDto, user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(IsWorkerGuard)
  @Patch(':id/addWorker')
  addWorker(@Param('id') id: number, @Body() addWorkerDto: AddWorkerDto) {
    return this.shelterService.addWorker(id, addWorkerDto.email);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateShelterDto: UpdateShelterDto) {
    return this.shelterService.update(id, updateShelterDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(IsWorkerGuard)
  @Put(':id/photos')
  addPhotos(
    @UserRequest() user: UserFromRequest,
    @Param('id') id: number,
    @Body() addAnimalPhotosDto: AddShelterPhotosDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.shelterService.addPhotos(id, files);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('id')
  delete(@Param('id') id: number) {
    return this.shelterService.delete(id);
  }
}
