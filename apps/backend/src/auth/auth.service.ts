
import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService
  ) {}

  async validarUsuario(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    await this.tokenService.saveToken(token, user.id);
    return {
      access_token: token
    };
  }
}
