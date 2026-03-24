export function requireInternalApiKey(request: Request) {
  const requestKey = request.headers.get("x-api-key");
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!expectedKey) {
    throw new Error("INTERNAL_API_KEY is not configured.");
  }

  if (!requestKey || requestKey !== expectedKey) {
    throw new Error("Invalid internal API key.");
  }
}
