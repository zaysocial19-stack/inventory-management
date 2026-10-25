import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. Register a new user with bcrypt password hashing
  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Check if email already registered
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException(`User with email "${normalizedEmail}" already exists`);
    }

    // Default to STAFF role if none specified
    const roleName = dto.roleName?.toUpperCase() ?? 'STAFF';
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException(`Role "${roleName}" does not exist. Available: ADMIN, MANAGER, STAFF`);
    }

    // Hash password with 10 salt rounds (1-way cryptographic hash)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: dto.fullName.trim(),
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    const { passwordHash: _, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // 2. Login, verify hash, emit signed JWT
  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare entered password with stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT claims payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    const accessToken = this.jwtService.sign(payload);

    const { passwordHash: _, ...sanitizedUser } = user;
    return {
      accessToken,
      user: sanitizedUser,
    };
  }
}
