
// Premium tier types
export type UserTier = 'silver' | 'gold' | 'platinum';

// Local storage keys
const USER_TIER_KEY = 'saveclass_user_tier';
const EXPORT_COUNT_KEY = 'saveclass_export_count';
const MAX_FREE_EXPORTS = 5;

// Get the user's current tier from localStorage
export const getUserTier = (): UserTier => {
  const storedTier = localStorage.getItem(USER_TIER_KEY);
  if (storedTier && (storedTier === 'silver' || storedTier === 'gold' || storedTier === 'platinum')) {
    return storedTier as UserTier;
  }
  // Default to silver (free tier)
  setUserTier('silver');
  return 'silver';
};

// Set the user's tier
export const setUserTier = (tier: UserTier): void => {
  localStorage.setItem(USER_TIER_KEY, tier);
};

// Check if the user is premium (gold or platinum)
export const isPremiumUser = (): boolean => {
  const tier = getUserTier();
  return tier === 'gold' || tier === 'platinum';
};

// Track exports for free users
export const trackExport = (): boolean => {
  if (isPremiumUser()) return true;
  
  const currentCount = getExportCount();
  if (currentCount >= MAX_FREE_EXPORTS) {
    return false;
  }
  
  localStorage.setItem(EXPORT_COUNT_KEY, (currentCount + 1).toString());
  return true;
};

// Get the current export count for free users
export const getExportCount = (): number => {
  const count = localStorage.getItem(EXPORT_COUNT_KEY);
  return count ? parseInt(count) : 0;
};

// Get remaining exports for free users
export const getRemainingExports = (): number => {
  if (isPremiumUser()) return Infinity;
  
  const currentCount = getExportCount();
  return Math.max(0, MAX_FREE_EXPORTS - currentCount);
};

// Reset export count (for testing or account changes)
export const resetExportCount = (): void => {
  localStorage.setItem(EXPORT_COUNT_KEY, '0');
};
