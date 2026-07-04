import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type User = {
  id: number;
  name: string;
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
