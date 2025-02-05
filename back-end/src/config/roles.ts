import { Role } from "@prisma/client"

// Permissões de cada cargo do sistema
const allRoles = {
  [Role.USER]: ["getClients", "getDeals", "getNotes", "manageNotes"],
  [Role.ADMIN]: [
    "lerUsuarios",
    "editarUsuarios",
    "getClients",
    "manageClients",
    "getUsers",
    "manageUsers",
    "getDeals",
    "manageDeals",
    "getUsers",
    "manageUsers",
    "getClients",
    "manageClients",
    "getNotes",
    "manageNotes",
  ],
  [Role.FINANCEIRO]: [
    "lerUsuarios",
    "getClients",
    "getNotes",
    "getDeals",
    "manageDeals",
  ],
  [Role.MARKETING]: [
    "lerUsuarios",
    "getClients",
    "getNotes",
    "manageClients",
    "getDeals",
  ],
}

export const roles = Object.keys(allRoles)
export const roleRights = new Map(Object.entries(allRoles))
