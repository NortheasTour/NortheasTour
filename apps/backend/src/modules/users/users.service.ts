import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

type User = {
  id: number;
  username: string;
  email: string;
  senha: string;
};

@Injectable()
export class UsersService {

  private users: User[] = [];

  listUsers(): User[] {
    return this.users;
  }

  create(createUserDto: CreateUserDto) {

    if (this.users.some((user) => user.email === createUserDto.email)) {
      throw new ConflictException('Email já existe');
    }

    if (this.users.some((user) => user.username === createUserDto.username)) {
      throw new ConflictException('Nome de usuário já existe');
    }

    const novoId =
      this.users.length > 0
        ? Math.max(...this.users.map((u) => u.id)) + 1
        : 1;

    const newUser: User = {
      id: novoId, ...createUserDto
    };

    this.users.push(newUser);
    return newUser;
  }
}
