import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role,
        organizationId,
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async findAll(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });
    return users;
  }

  async findOne(organizationId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId },
      include: {
        teamMemberships: { include: { team: true } },
        _count: { select: { assignedTasks: true } },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(organizationId: string, userId: string, dto: UpdateUserDto) {
    await this.findOne(organizationId, userId);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(organizationId: string, userId: string) {
    await this.findOne(organizationId, userId);
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Usuário removido com sucesso' };
  }
}
