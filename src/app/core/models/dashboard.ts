export interface ActiveCompaniesResponse {
  companiesCount: number;
  message: string;
  status: number;
}

export interface ActiveDevelopersResponse {
  developersCount: number;
  message: string;
  status: number;
}

export interface ProjectsByStatusResponse {
  statusCounts: {
    Pendiente: number;
    Activo: number;
    Inactivo: number;
    Rechazado: number;
    Finalizado: number;
    [key: string]: number;
  };
  message: string;
  status: number;
}

export interface ReportsByStatusResponse {
  statusCounts: {
    Pendiente: number;
    Resuelto: number;
    Rechazado: number;
    [key: string]: number;
  };
  message: string;
  status: number;
}

export interface TotalCategoriesResponse {
  total: number;
  message: string;
  status: number;
}

export interface AdminsByStatusResponse {
  statusCounts: {
    active: number;
    inactive: number;
    [key: string]: number;
  };
  message: string;
  status: number;
}

export interface RatingDistributionItem {
  score: number;
  count: number;
}

export interface RatingsDistributionResponse extends Array<RatingDistributionItem> {}