import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(companyId?: string): Promise<UserDocument[]> {
    const filter = companyId ? { company: new Types.ObjectId(companyId) } : {};
    return this.userModel.find(filter).select('-password').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async findByCompany(companyId: string): Promise<UserDocument[]> {
    return this.userModel
      .find({ company: new Types.ObjectId(companyId) })
      .select('-password')
      .exec();
  }

  async findManagers(companyId: string): Promise<UserDocument[]> {
    return this.userModel
      .find({
        company: new Types.ObjectId(companyId),
        role: { $in: ['Manager', 'Admin'] },
      })
      .select('-password')
      .exec();
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const result = await this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );

    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
