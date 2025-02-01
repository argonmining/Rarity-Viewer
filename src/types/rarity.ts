export interface RarityData {
  nft_rarity: {
    [key: string]: {
      rarity_score: number;
      rank: number;
      rarity_tier: string;
    };
  };
  trait_rarity: {
    [traitType: string]: {
      [value: string]: {
        percentage: number;
        rarity_tier: string;
      };
    };
  };
} 