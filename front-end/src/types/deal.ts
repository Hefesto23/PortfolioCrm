// src/types/deal.ts
export type DealStage =
  | "INITIAL_CONTACT"
  | "NEGOTIATION"
  | "PROPOSAL"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  clientId: string;
  userId: string;
  closeDate?: string;
}

export interface CreateDealData {
  title: string;
  value: number;
  clientId: string;
}

export interface UpdateDealData {
  title?: string;
  value?: number;
  stage?: DealStage;
  closeDate?: string;
}
