export const refreshTimers: { [cacheKey: string]: number } = {};

export function startRefreshTimer(
  getAccessTokenNative: ()=>void,
  expires_in: number
) {
  return window.setTimeout(async () => {
    await getAccessTokenNative();
  }, expires_in * 1000 - 60000);
}

