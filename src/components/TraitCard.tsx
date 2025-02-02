interface TraitCardProps {
  trait: {
    trait_type: string
    value: string
  }
  rarity: {
    percentage: number
    rarity_tier: string
  }
}

export default function TraitCard({ trait, rarity }: TraitCardProps) {
  return (
    <div className="bg-gray-900/50 p-3.5 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
      <div className="flex justify-between items-center mb-1.5">
        <p className="text-gray-400 text-xs uppercase tracking-wider">
          {trait.trait_type}
        </p>
        <span className="text-xs text-gray-400">
          {rarity.percentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-white text-sm font-medium truncate mr-2">
          {trait.value}
        </p>
        <span 
          className="shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: `${getRarityColor(rarity.rarity_tier)}15`,
            color: getRarityColor(rarity.rarity_tier),
            border: `1px solid ${getRarityColor(rarity.rarity_tier)}50`
          }}
        >
          {rarity.rarity_tier}
        </span>
      </div>
    </div>
  )
}

function getRarityColor(tier: string): string {
  switch (tier) {
    case 'Legendary': return '#FFD700'
    case 'Epic': return '#9370DB'
    case 'Rare': return '#4169E1'
    case 'Uncommon': return '#32CD32'
    case 'Common': return '#808080'
    default: return '#FFFFFF'
  }
} 