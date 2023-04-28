import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
