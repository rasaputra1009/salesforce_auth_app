export interface Account {
    Id: string;
    Name: string;
    Industry?: string;
    Phone?: string;
  }
  
  export interface PaginatedResponse {
    accounts: Account[];
    currentPage: number;
    totalPages: number;
    totalSize: number;
  }
  