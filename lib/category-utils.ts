
export const CATEGORY_ALIASES: Record<string, string> = {
  // Quantitative
  "quantitative": "quantitative",
  "quant": "quantitative",
  "math": "quantitative",
  "aptitude": "quantitative",

  // Logical Reasoning
  "logical": "logical-reasoning",
  "reasoning": "logical-reasoning",
  "logical-reasoning": "logical-reasoning",
  "lr": "logical-reasoning",

  // Verbal Ability
  "verbal": "verbal-ability",
  "english": "verbal-ability",
  "verbal-ability": "verbal-ability",
  "va": "verbal-ability",

  // Data Interpretation
  "di": "data-interpretation",
  "data-interpretation": "data-interpretation",
  "data": "data-interpretation",

  // Coding MCQs
  "coding": "coding-mcqs",
  "coding-mcqs": "coding-mcqs",
  "cs": "coding-mcqs",
  "programming": "coding-mcqs",

  // Object-Oriented Programming
  "oops": "object-oriented-programming",
  "oop": "object-oriented-programming",
  "object-oriented-programming": "object-oriented-programming",

  // Interview Preparation
  "interview": "interview-preparation",
  "interview-preparation": "interview-preparation",
}

export const KNOWN_VALID_CATEGORIES = [
  "quantitative",
  "logical-reasoning",
  "verbal-ability",
  "data-interpretation",
  "coding-mcqs",
  "object-oriented-programming",
  "interview-preparation",
]

export const CATEGORY_COLORS: Record<string, string> = {
  quantitative: "#6ee7c9",
  "logical-reasoning": "#8b7cf6",
  "data-interpretation": "#3ecf8e",
  "coding-mcqs": "#f5a623",
  "interview-preparation": "#f2555a",
  "object-oriented-programming": "#f2896b",
  "verbal-ability": "#22d3ee",
}

/**
 * Resolves any category alias, abbreviation, or slug into its canonical database slug.
 * Returns null if input is null, undefined, or empty.
 */
export function resolveCategorySlug(slugOrAlias?: string | null): string | null {
  if (!slugOrAlias) return null
  const cleaned = slugOrAlias.toLowerCase().trim()
  if (!cleaned) return null
  return CATEGORY_ALIASES[cleaned] || cleaned
}

export function getCategoryColor(slugOrAlias?: string | null): string {
  const resolved = resolveCategorySlug(slugOrAlias)
  return (resolved && CATEGORY_COLORS[resolved]) || CATEGORY_COLORS.quantitative
}

/**
 * Validates whether a category slug or alias is valid against a list of active categories
 * or known platform categories.
 */
export function isValidCategorySlug(
  slugOrAlias?: string | null,
  activeCategories?: { slug: string }[]
): boolean {
  const resolved = resolveCategorySlug(slugOrAlias)
  if (!resolved) return false

  if (activeCategories && activeCategories.length > 0) {
    return activeCategories.some((cat) => cat.slug.toLowerCase() === resolved.toLowerCase())
  }

  return KNOWN_VALID_CATEGORIES.includes(resolved)
}

/**
 * Generates a consistent test URL:
 * - If subcategory is provided: `/dashboard/tests/runner?category=${cat}&subcategory=${sub}`
 * - If only category is provided: `/dashboard/tests?category=${cat}`
 */
export function buildTestUrl(categorySlug: string, subcategorySlug?: string): string {
  const resolved = resolveCategorySlug(categorySlug) || categorySlug
  if (subcategorySlug) {
    return `/dashboard/tests/runner?category=${encodeURIComponent(resolved)}&subcategory=${encodeURIComponent(subcategorySlug)}`
  }
  return `/dashboard/tests?category=${encodeURIComponent(resolved)}`
}
