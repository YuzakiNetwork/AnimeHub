import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import db from './database';

export interface Admin {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export class AuthService {
  // Verify admin credentials
  static async verifyAdmin(username: string, password: string): Promise<Admin | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM admins WHERE username = ?',
        [username],
        async (err, row: Admin) => {
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          try {
            const isValid = await bcrypt.compare(password, row.password);
            if (isValid) {
              resolve(row);
            } else {
              resolve(null);
            }
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Create admin
  static async createAdmin(username: string, password: string): Promise<number> {
    const hashedPassword = await this.hashPassword(password);
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  // Get admin by ID
  static async getAdminById(id: number): Promise<Admin | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM admins WHERE id = ?',
        [id],
        (err, row: Admin) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }
}

// Session management for API routes
export function getSessionFromRequest(request: NextRequest): { adminId?: number } {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return {};
    }

    // In a real app, you'd want to use a proper session store
    // For simplicity, we're using a basic approach
    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData;
  } catch {
    return {};
  }
}

export function createSessionCookie(adminId: number): string {
  const sessionData = { adminId, timestamp: Date.now() };
  return JSON.stringify(sessionData);
}

