import axios, { AxiosInstance } from 'axios';

export interface SafeCommsConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface TextModerationRequest {
  content: string;
  language?: string;
  replace?: boolean;
  pii?: boolean;
  replaceSeverity?: string;
  moderationProfileId?: string;
}

export interface UsageResponse {
  tier: string;
  rateLimit: number;
  tokenLimit: number | null;
  tokensUsed: number;
  remainingTokens: number;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: any;
}

export class SafeCommsError extends Error {
  public status?: number;
  public problem?: ProblemDetails;

  constructor(message: string, status?: number, problem?: ProblemDetails) {
    super(message);
    this.name = 'SafeCommsError';
    this.status = status;
    this.problem = problem;
  }
}

export class SafeCommsClient {
  private client: AxiosInstance;

  constructor(config: SafeCommsConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.safecomms.dev',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error) && error.response) {
      const problem = error.response.data as ProblemDetails;
      throw new SafeCommsError(
        problem.detail || problem.title || error.message,
        error.response.status,
        problem
      );
    }
    throw error;
  }

  async moderateText(request: TextModerationRequest): Promise<any> {
    try {
      const response = await this.client.post('/moderation/text', {
        language: 'en',
        replace: false,
        pii: false,
        ...request,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getUsage(): Promise<UsageResponse> {
    try {
      const response = await this.client.get<UsageResponse>('/usage');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
