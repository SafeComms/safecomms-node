import { SafeCommsClient } from '../src/index';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SafeCommsClient', () => {
  let client: SafeCommsClient;

  beforeEach(() => {
    mockedAxios.create.mockReturnThis();
    client = new SafeCommsClient({ apiKey: 'test-key' });
  });

  it('should moderate text successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { isClean: true, severity: 'none' }
    });

    const result = await client.moderateText({ content: 'test content' });

    expect(result.isClean).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith('/moderation/text', expect.objectContaining({
      content: 'test content'
    }));
  });

  it('should get usage successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { tokensUsed: 100, tier: 'Free' }
    });

    const result = await client.getUsage();

    expect(result.tokensUsed).toBe(100);
    expect(mockedAxios.get).toHaveBeenCalledWith('/usage');
  });
});
