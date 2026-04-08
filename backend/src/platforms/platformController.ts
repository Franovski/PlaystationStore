import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PlatformService } from './platformService';
import { CreatePlatformDto, UpdatePlatformDto } from './platformDto';

@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  async getAll() {
    return this.platformService.getAllPlatforms();
  }

  @Get('name/:name')
  async getOneByName(@Param('name') name: string) {
    return this.platformService.getPlatformByName(name);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.platformService.getPlatformById(id);
  }

  @Post()
  async create(@Body() createDto: CreatePlatformDto) {
    return this.platformService.createPlatform(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePlatformDto,
  ) {
    return this.platformService.updatePlatform(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.platformService.deletePlatform(id);
  }
}