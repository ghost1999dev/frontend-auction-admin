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
  export interface Admin {
    id: number;
    full_name: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    image: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    role_id:number;
  }
  
  export interface AdminCreateRequest {
    full_name: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    image: string;
  }
  
  export interface AdminUpdateRequest {
    full_name?: string;
    phone?: string;
    email?: string;
    username?: string;
    password?: string;
    image?: string;
    status?: string;
  }
  
  export interface AdminResponse {
    error: boolean;
    message?: string;
    data: Admin | any;
    count?: number;
    project: any[]
    missingFields?: string[];
    errors?: { field: string; message: string }[];
  }
  
  export interface ProjectStatusUpdate {
    newStatus: number; // 0: Pending, 1: Active, 3: Rejected, 4: Completed
  }