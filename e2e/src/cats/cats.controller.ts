import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiDefaultGetter,
  ApiExtension,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiCallbacks,
  getSchemaPath
} from '../../../lib';
import { CatsService } from './cats.service';
import { Cat } from './classes/cat.class';
import { CreateCatDto } from './dto/create-cat.dto';
import { LettersEnum, PaginationQuery } from './dto/pagination-query.dto';

@ApiSecurity('basic')
@ApiBearerAuth()
@ApiSecurity({ key2: [], key1: [] })
@ApiTags('cats')
@ApiHeader({
  name: 'header',
  required: false,
  description: 'Test',
  schema: { default: 'test' }
})
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @ApiCallbacks({
    name: 'mySecondEvent',
    callbackUrl: '{$request.body#/callbackUrl}',
    method: 'post',
    requestBody: {
      type: Cat
    },
    expectedResponse: {
      status: 200
    }
  })
  @ApiCallbacks({
    name: 'myEvent',
    callbackUrl: '{$request.body#/callbackUrl}',
    method: 'post',
    requestBody: {
      type: Cat
    },
    expectedResponse: {
      status: 200
    }
  })
  @ApiTags('create cats')
  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: () => Cat
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiExtension('x-foo', { test: 'bar ' })
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Post('explicit-body')
  @ApiBody({
    type: CreateCatDto,
    examples: {
      mau: {
        summary: 'Mau example',
        value: {
          name: 'Mau cat',
          age: 5,
          breed: 'Mau'
        }
      }
    }
  })
  async createExplicitBody(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Cat
  })
  @ApiExtension('x-auth-type', 'NONE')
  @ApiDefaultGetter(Cat, 'id')
  findOne(@Param('id') id: string): Cat {
    return this.catsService.findOne(+id);
  }

  @Get()
  @ApiExtension('x-codeSamples', [
    { lang: 'JavaScript', source: "console.log('Hello World');" }
  ])
  @ApiExtension('x-multiple', { test: 'test' })
  @ApiTags('tag1')
  @ApiTags('tag2')
  findAll(@Query() paginationQuery: PaginationQuery) {}

  @ApiQuery({ type: PaginationQuery })
  @Get('explicit-query')
  findAllWithExplicitQuery(paginationQuery: PaginationQuery) {}

  @Get('bulk')
  findAllBulk(@Query() paginationQuery: PaginationQuery[]) {}

  @Post('bulk')
  async createBulk(@Body() createCatDto: CreateCatDto[]): Promise<Cat> {
    return null;
  }

  @ApiConsumes('application/x-www-form-urlencoded')
  @Post('as-form-data')
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Cat
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createAsFormData(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }

  @Get('site*')
  getSite() {}

  @Get('with-enum/:type')
  @ApiParam({
    name: 'type',
    enum: LettersEnum
  })
  getWithEnumParam(@Param('type') type: LettersEnum) {}

  @Get('with-enum-named/:type')
  @ApiParam({
    name: 'type',
    enum: LettersEnum,
    enumName: 'Letter'
  })
  getWithEnumNamedParam(@Param('type') type: LettersEnum) {}

  @Get('with-random-query')
  @ApiQuery({
    name: 'type',
    type: String,
    minLength: 10,
    maxLength: 100
  } as any)
  getWithRandomQuery(@Query('type') type: string) {}
}
