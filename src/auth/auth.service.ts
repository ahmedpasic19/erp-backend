import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/basic/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<users | null> {
    const { user } = await this.usersService.findOneByName(username);

    // validate password
    const validPassword = await this.comparePasswords(pass, user.password);

    if (user && validPassword) {
      // DON'T RETURN USER PASSWORD
      delete user.password;
      return user;
    }

    // Return null if validation fails
    return null;
  }

  private async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async login(user: users) {
    const payload = { username: user.name, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
    });

    // Return the user object
    const { user: db_user } = await this.usersService.findOne(user.id);

    // Remove password
    const user_no_pass = { ...db_user };
    delete user_no_pass.password;

    return {
      access_token,
      user: user_no_pass,
    };
  }
}
