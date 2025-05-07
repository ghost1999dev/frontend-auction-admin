export interface AdminLoginRequest {
    username: string;
    password: string;
  }
  
  export interface AdminLoginResponse {
    message: string;
    token: string;
  }
  
  export interface AdminProfile {
    id: number;
    full_name: string;
    email: string;
    username: string;
    status: string;
    // Add other admin properties as needed
  }