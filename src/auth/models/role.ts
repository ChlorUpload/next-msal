export type Role = "user" | "creator" | "admin";

export function parseRoles(rolesString?: string): Role[] {
  if (!rolesString) return [];

  const res: Role[] = [];
  if (rolesString.includes("User")) {
    res.push("user");
  }
  if (rolesString.includes("Creator")) {
    res.push("creator");
  }
  if (rolesString.includes("Admin")) {
    res.push("admin");
  }

  return res;
}
