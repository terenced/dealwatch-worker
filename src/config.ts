export interface ModelConfig {
  enabled: boolean;
  maxPrice?: number;
  minMemory?: string;
}

export type Config = Record<
  "macMini" | "macStudio" | "macBookPro",
  ModelConfig
>;

export const defaultConfig: Config = {
  macMini: { enabled: true },
  macStudio: { enabled: true },
  macBookPro: { enabled: true },
};
