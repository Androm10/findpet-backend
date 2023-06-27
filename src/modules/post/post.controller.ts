import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserRequest } from 'src/common/decorators/user.decorator';
import { UserFromRequest } from 'src/common/types/user-request';
import { IsWorkerGuard } from '../auth/guards/is-worker.guard';
import { AddPostsPhotosDto } from './dto/add-post-photos.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @NoAuth()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.postService.get(id);
  }

  @NoAuth()
  @Get()
  getAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.postService.getAll({}, limit, page);
  }

  @UseGuards(IsWorkerGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(
    @Param('id') id: number,
    @UserRequest() user: UserFromRequest,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, user.id, updatePostDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(IsWorkerGuard)
  @Put(':id/photos')
  addPhotos(
    @UserRequest() user: UserFromRequest,
    @Param('id') id: number,
    @Body() addPostPhotosDto: AddPostsPhotosDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postService.addPhotos(id, files);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.postService.delete(+id);
  }
}
