import prisma from '../../config/prisma';
import { hashPassword, comparePassword } from '../../utils/bcrypt.util';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.util';

export class AuthService {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async registerUser(data: any) {
    const { name, email, password, role } = data;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPwd = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPwd,
        role: role || 'USER',
      },
    });

    const tokenPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
  }

  async loginUser(data: any) {
    const { email, password } = data;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const tokenPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
  }
}

export const authService = new AuthService();
