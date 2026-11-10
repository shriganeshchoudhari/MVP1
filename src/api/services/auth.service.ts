import { ApiClient } from '../clients/apiClient.js';
import { LoginResponse, LoginResponseSchema } from '../schemas/auth.schema.js';
import { AssertionHelper } from '../../helpers/assertion.helper.js';

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async authenticate(userId: string, password: string): Promise<LoginResponse> {
    const response = await this.apiClient.post('/auth/login', { userId, password });
    const json = await response.json();
    return AssertionHelper.validateSchema(LoginResponseSchema, json);
  }
}
