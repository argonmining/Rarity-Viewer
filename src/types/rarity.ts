export interface RarityData {
  trait_rarity: {
    [key: string]: {
      [key: string]: {
        count: number;
        percentage: number;
        rarity_tier: string;
      };
    };
  };
  nft_rarity: {
    [key: string]: {
      rarity_score: number;
      rarity_metrics: {
        statistical_rarity: number;
        trait_rarity: number;
        weighted_average: number;
      };
      is_special: boolean;
      rarity_tier: string;
      rank: number;
      trait_breakdown: Array<{
        trait_type: string;
        value: string;
        percentage: number;
        trait_score: number;
        weight: number;
        weighted_score: number;
        rarity_tier: string;
      }>;
    };
  };
} 