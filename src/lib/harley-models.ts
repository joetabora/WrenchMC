// Comprehensive Harley-Davidson Models and Variants
// Updated with all common variants including Road King Classic

export const HARLEY_YEARS = Array.from({ length: 30 }, (_, i) => String(1995 + i))

export const HARLEY_MODELS = [
  'Softail',
  'Sportster',
  'Dyna',
  'Road King',
  'Street Glide',
  'Road Glide',
  'Fat Boy',
  'Heritage Classic',
  'Low Rider',
  'Electra Glide',
  'Breakout',
  'Street Bob',
  'Fat Bob',
  'Iron 883',
  'Iron 1200',
  'Forty-Eight',
  'SuperLow',
  'Nightster',
  'Night Rod',
  'V-Rod',
  'CVO',
  'Pan America',
  'LiveWire',
  'Freewheeler',
  'Tri Glide',
]

// Model-specific variants
export const HARLEY_VARIANTS: Record<string, string[]> = {
  'Road King': [
    'Standard',
    'Classic',
    'Special',
    'Custom',
    'Limited',
    'Elite',
    'CVO',
  ],
  'Softail': [
    'Standard',
    'Custom',
    'Deluxe',
    'Heritage Classic',
    'Fat Boy',
    'Breakout',
    'Low Rider',
    'Street Bob',
    'Fat Bob',
    'Slim',
    'Deluxe',
    'Standard',
  ],
  'Sportster': [
    'Standard',
    'Custom',
    'Iron 883',
    'Iron 1200',
    'Forty-Eight',
    'SuperLow',
    'Nightster',
    'Roadster',
    '1200 Custom',
    '883 Custom',
  ],
  'Dyna': [
    'Standard',
    'Super Glide',
    'Low Rider',
    'Street Bob',
    'Wide Glide',
    'Switchback',
    'Super Glide Custom',
  ],
  'Street Glide': [
    'Standard',
    'Special',
    'CVO',
    'Limited',
  ],
  'Road Glide': [
    'Standard',
    'Special',
    'CVO',
    'Limited',
    'ST',
  ],
  'Fat Boy': [
    'Standard',
    'Special',
    '114',
    'Lo',
  ],
  'Heritage Classic': [
    'Standard',
    'Softail',
    '114',
  ],
  'Low Rider': [
    'Standard',
    'S',
    'ST',
  ],
  'Electra Glide': [
    'Standard',
    'Ultra Classic',
    'Ultra Limited',
    'Police',
    'CVO',
  ],
  'Breakout': [
    'Standard',
    '114',
  ],
  'Street Bob': [
    'Standard',
    '114',
  ],
  'Fat Bob': [
    'Standard',
    '114',
  ],
  'Iron 883': [
    'Standard',
  ],
  'Iron 1200': [
    'Standard',
  ],
  'Forty-Eight': [
    'Standard',
    'Special',
  ],
  'SuperLow': [
    'Standard',
  ],
  'Nightster': [
    'Standard',
  ],
  'Night Rod': [
    'Standard',
  ],
  'V-Rod': [
    'Standard',
    'Muscle',
    'Night Rod',
  ],
  'CVO': [
    'Street Glide',
    'Road Glide',
    'Road King',
    'Softail',
  ],
  'Pan America': [
    'Standard',
    'Special',
    '1250',
  ],
  'LiveWire': [
    'Standard',
    'One',
  ],
  'Freewheeler': [
    'Standard',
  ],
  'Tri Glide': [
    'Standard',
    'Ultra',
  ],
}

// Get all unique variants across all models
export function getAllVariants(): string[] {
  const variantSet = new Set<string>()
  Object.values(HARLEY_VARIANTS).forEach(variants => {
    variants.forEach(v => variantSet.add(v))
  })
  return Array.from(variantSet).sort()
}

// Get variants for a specific model
export function getVariantsForModel(model: string): string[] {
  return HARLEY_VARIANTS[model] || ['Standard', 'Custom', 'Limited', 'Special', 'Deluxe']
}
