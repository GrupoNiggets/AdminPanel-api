export const bugsFields = {
  id: 'string',
  name: 'string',
  email: 'string',
  role: 'string',
  createdAt: 'date',
  updatedAt: 'date'
}

export function toPublicBugs (bugs) {
  if (!bugs) return null
  const { id, name, email, role, createdAt, updatedAt } = bugs
  return { id, name, email, role, createdAt, updatedAt }
}

export default { bugsFields, toPublicBugs }


