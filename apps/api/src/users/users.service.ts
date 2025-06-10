import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      email: 'teste@email.com',
      password: bcrypt.hashSync('123456', 10),
    },
  ];

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }
}
