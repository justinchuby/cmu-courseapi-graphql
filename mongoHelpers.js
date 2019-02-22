export function stringToRegexQuery(val) {
  return { $regex: new RegExp(val) }
}
