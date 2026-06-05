export type PoolTier = "tier_15" | "tier_50" | "tier_150";

export interface TierConfig {
  id: PoolTier;
  maxPlayers: number;
  entryFeeCents: number;
  label: string;
  pricePerPerson: string;
}

export const POOL_TIERS: TierConfig[] = [
  {
    id: "tier_15",
    maxPlayers: 15,
    entryFeeCents: 990,
    label: "Até 15 pessoas",
    pricePerPerson: "R$ 9,90",
  },
  {
    id: "tier_50",
    maxPlayers: 50,
    entryFeeCents: 590,
    label: "Até 50 pessoas",
    pricePerPerson: "R$ 5,90",
  },
  {
    id: "tier_150",
    maxPlayers: 150,
    entryFeeCents: 350,
    label: "Até 150 pessoas",
    pricePerPerson: "R$ 3,50",
  },
];

export const getTier = (id: string): TierConfig =>
  POOL_TIERS.find((t) => t.id === id) ?? POOL_TIERS[1];

export const formatFee = (cents: number): string =>
  `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;

export const buildInviteUrl = (joinCode: string): string =>
  `${window.location.origin}/join/${joinCode}`;
