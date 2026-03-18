export function getSquareClient() {
  // Lazy import keeps client creation server-only and avoids accidental bundling.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { SquareClient, SquareEnvironment } = require('square')

  if (!process.env.SQUARE_ACCESS_TOKEN) {
    throw new Error('Missing SQUARE_ACCESS_TOKEN environment variable')
  }

  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
  })

  return {
    refunds: client.refunds,
    client,
  }
}
