import axios, { AxiosInstance } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

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

export interface ImageModerationRequest {
  image: string;
  language?: string;
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

  async moderateImage(request: ImageModerationRequest): Promise<any> {
    try {
      const response = await this.client.post('/moderation/image', {
        language: 'en',
        ...request,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async moderateImageFile(filePath: string, language: string = 'en', moderationProfileId?: string): Promise<any> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64Image = fileBuffer.toString('base64');
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      let mime = 'image/jpeg';
      if (ext === 'png') mime = 'image/png';
      else if (ext === 'webp') mime = 'image/webp';
      else if (ext === 'gif') mime = 'image/gif';
      
      const dataUri = `data:${mime};base64,${base64Image}`;
      
      return await this.moderateImage({
        image: dataUri,
        language,
        moderationProfileId
      });
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
