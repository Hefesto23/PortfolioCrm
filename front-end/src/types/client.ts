// src/types/client.ts
export type ClientStatus = "LEAD" | "PROSPECT" | "CLIENT" | "INACTIVE";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ClientStatus;
  userId: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: ClientStatus;
}
