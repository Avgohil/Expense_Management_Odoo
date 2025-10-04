import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { SubmitExpenseDto } from './dto/submit-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'receipts', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/receipts',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(
    @Body() createExpenseDto: CreateExpenseDto,
    @Request() req,
    @UploadedFiles() files: { receipts?: Express.Multer.File[] },
  ) {
    if (files && files.receipts && files.receipts.length > 0) {
      (createExpenseDto as any).receiptUrl = files.receipts[0].path;
    }
    return this.expensesService.create(
      createExpenseDto,
      req.user.userId,
      req.user.companyId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiResponse({ status: 200, description: 'Return all expenses' })
  findAll(
    @Request() req,
    @Query('status') status?: string,
  ) {
    return this.expensesService.findAll(
      req.user.companyId,
      req.user.userId,
      status,
    );
  }

  @Get('my-expenses')
  @ApiOperation({ summary: 'Get expenses for the current user' })
  @ApiResponse({ status: 200, description: 'Return user expenses' })
  getMyExpenses(@Request() req, @Query('status') status?: string) {
    return this.expensesService.getExpensesByUser(req.user.userId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({ status: 200, description: 'Return the expense' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit expense for approval' })
  @ApiResponse({ status: 200, description: 'Expense submitted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  submit(@Param('id') id: string, @Body() submitExpenseDto: SubmitExpenseDto) {
    return this.expensesService.submit(id);
  }
}
