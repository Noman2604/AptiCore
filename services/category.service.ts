import { apiClient } from "./api-client"

export interface SubcategoryDTO {
  _id: string
  name: string
  slug: string
  description?: string
  displayOrder?: number
  questionCount?: number
}

export interface CategoryDTO {
  _id: string
  name: string
  slug: string
  description?: string
  colorCode?: string
  iconUrl?: string
  displayOrder?: number
  isActive: boolean
  questionCount?: number
  subcategories?: SubcategoryDTO[]
}

export const CategoryService = {
  /**
   * Fetch all active categories with their subtopics and question counts
   */
  async getAll(): Promise<CategoryDTO[]> {
    const res = await apiClient.get<{ success: boolean; data: CategoryDTO[] }>(
      "/categories"
    )
    return res.data.data || []
  },

  /**
   * Fetch a single category by slug
   */
  async getBySlug(slug: string): Promise<CategoryDTO | null> {
    const res = await apiClient.get<{ success: boolean; data: CategoryDTO }>(
      `/categories/${encodeURIComponent(slug)}`
    )
    return res.data.data || null
  },
}
