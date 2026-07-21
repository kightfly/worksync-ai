export function extractBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token.length > 0 ? token : null;
}