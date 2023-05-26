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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserRequest } from 'src/common/decorators/user.decorator';
import { UserFromRequest } from 'src/common/types/user-request';
import { IsWorkerGuard } from '../auth/guards/is-worker.guard';
import { AnimalService } from './animal.service';
import { AddAnimalPhotosDto } from './dto/add-animal-photos.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { GetAnimalsDto } from './dto/get-animals.dto';
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
  @Get('getByShelterId/:id')
  getByShelterId(
    @Param('id') id: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.animalService.getByShelterId(id, limit, page);
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get('getByUserId/:id')
  getByUserId(
    @Param('id') id: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.animalService.getByUserId(id, limit, page);
  }

  @UseInterceptors(CacheInterceptor)
  @NoAuth()
  @Get()
  getAll(@Query() { limit, page, ...filter }: GetAnimalsDto) {
    return this.animalService.getAll(filter, limit, page);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(IsWorkerGuard)
  @Post()
  create(
    @Body() createAnimalDto: CreateAnimalDto,
    @UserRequest() user: UserFromRequest,
  ) {
    createAnimalDto.userId = user.id;
    return this.animalService.create(createAnimalDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.update(id, updateAnimalDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @Put(':id/photos')
  updateAvatar(
    @UserRequest() user: UserFromRequest,
    @Param('id') id: number,
    @Body() addAnimalPhotosDto: AddAnimalPhotosDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.animalService.addPhotos(id, files);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id/favorite')
  makeFavorite(@Param('id') id: number, @UserRequest() user: UserFromRequest) {
    return this.animalService.makeFavorite(id, user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('id')
  delete(@Param('id') id: number) {
    return this.animalService.delete(id);
  }
}
