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
    url_base: string;
  }
  
  export interface AdminUpdateRequest {
    //full_name?: string;
    phone?: string;
    //email?: string;
    //username?: string;
    //password?: string;
    //image?: string;
    status?: string;
  }
  
  export interface AdminResponse {
    error: boolean;
    message?: string;
    data: Admin | any;
    admins: Admin | any;
    count?: number;
    project: any[]
    missingFields?: string[];
    errors?: { field: string; message: string }[];
  }
  
  export interface ProjectStatusUpdate {
    newStatus: number; // 0: Pending, 1: Active, 3: Rejected, 4: Completed
    reason: any;
  }

  export interface AdminLoginRequest {
    username: string;
    password: string;
}

export interface AdminLoginResponse {
    message: string;
    token: string;
    data: {
        token: string;
        admin: Admin;
    };
}

export interface AdminProfile {
    id: number;
    full_name: string;
    email: string;
    username: string;
    status: string;
    phone?: string;
    image?: string;
    role_id: number;
    role_name?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UsernameGenerationResponse {
    error: boolean;
    data: {
        suggested_username: string;
    };
    status: number;
}

export interface Report {
    id: number;
    reporter_id: number;
    reporter_name: string;
    reporter_email: string;
    reportedUser_id: number;
    reportedUser_name: string;
    reportedUser_email: string;
    user_role: string;
    project_id: number;
    project_name: string;
    reason: string;
    comment: string;
    status: string;
    admin_response?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReportsResponse {
    data: Report[];
    total: number;
    page: number;
    totalPages: number;
}

export interface PasswordResetRequest {
    email: string;
    code: string;
    password: string;
}

export interface ImageUploadResponse {
    error: boolean;
    message: string;
    data: {
        imageUrl: string;
    };
    status: number;
}