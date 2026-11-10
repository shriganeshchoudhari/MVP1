import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '../../utils/logger.js';

/**
 * Enterprise API Client wrapper over Playwright APIRequestContext.
 */
export class ApiClient {
  readonly request: APIRequestContext;
  private authToken?: string;

  constructor(request: APIRequestContext, authToken?: string) {
    this.request = request;
    this.authToken = authToken;
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  public async get(url: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    logger.debug(`API GET: ${url}`, 'ApiClient');
    return await this.request.get(url, { headers: this.getHeaders(headers) });
  }

  public async post(url: string, data: unknown, headers: Record<string, string> = {}): Promise<APIResponse> {
    logger.debug(`API POST: ${url}`, 'ApiClient');
    return await this.request.post(url, {
      data,
      headers: this.getHeaders(headers),
    });
  }

  public async put(url: string, data: unknown, headers: Record<string, string> = {}): Promise<APIResponse> {
    logger.debug(`API PUT: ${url}`, 'ApiClient');
    return await this.request.put(url, {
      data,
      headers: this.getHeaders(headers),
    });
  }

  public async delete(url: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    logger.debug(`API DELETE: ${url}`, 'ApiClient');
    return await this.request.delete(url, { headers: this.getHeaders(headers) });
  }
}
