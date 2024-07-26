export const compactObject = (obj: any) => Object.keys(obj)
  .filter((k) => Boolean(obj[k]))
  .reduce((a, k) => ({ ...a, [k]: obj[k] }), {})