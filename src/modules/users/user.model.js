//EXPORT userFields (CAMPOS DE USUARIO)
export const userFields = {
  id: "string",
  name: "string",
  email: "string",
  role: "string",
  createdAt: "date",
  updatedAt: "date",
};

//EXPORT toPublicUser
export function toPublicUser(user) {
  if (!user) return null;
  const { id, name, email, role, createdAt, updatedAt } = user;
  return { id, name, email, role, createdAt, updatedAt };
}

export default { userFields, toPublicUser };
