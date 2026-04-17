import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index.js';
import type { IUserDocument } from '../models/Usuario.js';
import type { RegisterInput, LoginInput } from '../validators/auth.js';
import type { JWTPayload } from '../types/index.js';

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: IUserDocument; token: string }> {
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(data: LoginInput): Promise<{ user: IUserDocument; token: string }> {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async validateToken(token: string): Promise<JWTPayload> {
    try {
      const secret = process.env.JWT_SECRET || 'default-secret';
      const decoded = jwt.verify(token, secret) as JWTPayload;
      return decoded;
    } catch {
      throw new Error('Token inválido');
    }
  }

  async getUserById(userId: string): Promise<IUserDocument | null> {
    return UserModel.findById(userId);
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    return UserModel.find().populate('empresaId', 'nombre');
  }

  private generateToken(user: IUserDocument): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      rol: user.rol,
      empresaId: user.empresaId?.toString(),
    };
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = '7d';
    return jwt.sign(payload, secret, { expiresIn });
  }
}

export const authService = new AuthService();