import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { RespostaDto } from './dto/resposta.dto';
import * as bcrypt from 'bcrypt';

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

  create(createUserDto: CreateUserDto): RespostaDto {

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
      id: novoId,
      username: createUserDto.username,
      email: createUserDto.email,
      senha: bcrypt.hashSync(createUserDto.senha, 8),
    };

    const { senha, ...userSemSenha } = newUser;
    this.users.push(newUser);
    return userSemSenha;
  }
}
