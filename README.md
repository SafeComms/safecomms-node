# SafeComms Node.js SDK

Official Node.js client for the SafeComms API.

SafeComms is a powerful content moderation platform designed to keep your digital communities safe. It provides real-time analysis of text to detect and filter harmful content, including hate speech, harassment, and spam.

**Get Started for Free:**
We offer a generous **Free Tier** for all users, with **no credit card required**. Sign up today and start protecting your community immediately.

## Documentation

For full API documentation and integration guides, visit [https://safecomms.dev/docs](https://safecomms.dev/docs).

## Installation

```bash
npm install safecomms
```

## Usage

```typescript
import { SafeCommsClient } from 'safecomms';

const client = new SafeCommsClient({
  apiKey: 'your-api-key'
});

async function main() {
  // Moderate text
  const result = await client.moderateText({
    content: 'Some text to check',
    language: 'en',
    replace: true
  });
  console.log(result);

  // Get usage
  const usage = await client.getUsage();
  console.log(usage);
}

main();
```
