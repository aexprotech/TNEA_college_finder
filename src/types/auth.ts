// src/types/auth.ts
export interface UserData {
  id: string;
  email: string;
  name: string;
  photo?: string;
  type: 'admin' | 'user';
}