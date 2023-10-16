import { getOffset } from './get-offset'

export const getLimit = ({ page, limit }: any) => {
  if (!page) {
    page = 1
  }
  if (!limit) {
    limit = Number(process.env.LIST_PER_PAGE)
  }

  const offset = getOffset(page, limit)
  return `LIMIT ${limit} OFFSET ${offset}`
}
