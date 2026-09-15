export interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  field: string | null;
  path: string;
  timestamp: string;
}
