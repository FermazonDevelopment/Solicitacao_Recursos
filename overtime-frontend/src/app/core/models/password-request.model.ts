export interface PasswordRequest {
  id: number;
  departmentName: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  requestedAt: string;
}
