export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
}

export interface ApiCallMetric {
  module: string;
  method: string;
  url: string;
  status: number;
  durationMs?: number;
  payload?: unknown;
}
