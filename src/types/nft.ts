export interface NFTMetadata {
  name?: string
  description?: string
  image?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface APIError {
  error: string
} 