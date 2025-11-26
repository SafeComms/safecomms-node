# SafeComms Node.js SDK

Official Node.js client for the SafeComms API.

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
