export function removeNullProperties(obj: any) {
  return Object.entries(obj)
    .filter(([_, v]) => v != null && v !== undefined)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}
