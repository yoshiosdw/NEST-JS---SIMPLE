import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { errorResponse, successResponse } from '../common/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        return errorResponse('Email not found', 404);
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return errorResponse('Incorrect password', 401);
      }

      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Masukkan token ke meta supaya Postman script bisa ambil
      return successResponse(
        { user: this.userService.sanitizeUser(user) }, // data hanya user
        'Login successful',
        { token }, // token masuk ke meta
      );
    } catch (err) {
      return errorResponse(err.message || 'Login failed', 500);
    }
  }
}
