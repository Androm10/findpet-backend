import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserRequest } from 'src/common/decorators/user.decorator';
import { UserFromRequest } from 'src/common/types/user-request';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  getProfile(@UserRequest() user: UserFromRequest) {
    return this.userService.get(user.id);
  }

  @NoAuth()
  @Get(':id')
  get(@Param('id') id: number) {
    return this.userService.get(id);
  }

  @NoAuth()
  @Get()
  getAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.userService.getAll({}, limit, page);
  }

  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put('profile')
  updateProfile(
    @UserRequest() user: UserFromRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Put('profile/avatar')
  updateAvatar(
    @UserRequest() user: UserFromRequest,
    @Body() updateAvatarDto: UpdateAvatarDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(user.id, avatar);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
