export function toRoleResponse(role: any) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

export function toRolesResponse(roles: any[]) {
  return roles.map(toRoleResponse);
}