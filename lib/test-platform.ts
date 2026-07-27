import { Types } from "mongoose"

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function createTestSlug(id: string, title: string) {
  return `${id}-${slugify(title)}`
}

export function extractTestId(testSlug: string) {
  const match = testSlug.match(/^([0-9a-fA-F]{24})/)
  if (!match) return null
  return match[1]
}

export function isObjectId(value: string) {
  return Types.ObjectId.isValid(value)
}
