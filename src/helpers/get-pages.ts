export const getPages = ({ total }: any, limit: number) => {
  const perPage = !limit ? Number(process.env.LIST_PER_PAGE) : limit

  return Math.ceil(total / perPage)
}
