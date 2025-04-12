// This file can be used to define custom types if needed
export interface User {
    id: number;
    email: string;
    password: string;
  }
  
  export interface JwtPayload {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
  }