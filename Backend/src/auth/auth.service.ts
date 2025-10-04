import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async signup(signupData: { name: string; email: string; password: string; country: string }) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(signupData.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create company (auto-create from user's country)
    const company = await this.companiesService.create({
      name: `${signupData.name}'s Company`,
      baseCurrency: 'USD', // Default, can be determined by country
      country: signupData.country,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    // Create admin user with company reference
    const userData = {
      name: signupData.name,
      email: signupData.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      company: company._id,
    };

    const user = await this.usersService.create(userData as any);

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      companyId: company._id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: company._id,
      },
    };
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      companyId: user.company,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate random password
    const randomPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Update user password
    await this.usersService.updatePassword(user._id.toString(), hashedPassword);

    // Send email with new password
    await this.notificationsService.sendPasswordResetEmail(email, user.name, randomPassword);

    return { message: 'New password sent to your email' };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user._id.toString(), hashedPassword);

    return { message: 'Password reset successfully' };
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
