import type { ModelConfig } from "./config";
import type { Tile } from "./types";

export const isMacBookBro = (t: Tile) =>
  t?.filters?.dimensions?.refurbClearModel === "macbookpro";

export const isMacMini = (t: Tile) =>
  t?.filters?.dimensions?.refurbClearModel === "macmini";

export const isMacStudio = (t: Tile) =>
  t?.filters?.dimensions?.refurbClearModel === "macstudio";

export const isM2 = (t: Tile) =>
  t?.title?.includes("M2 Chip") || t?.title?.includes("M2 Pro");

export const targetCapacity = (t: Tile) =>
  t?.filters?.dimensions?.dimensionCapacity !== "256gb";

export const meetsMemory = (config: ModelConfig) => (t: Tile) => {
  if (config.minMemory === undefined) {
    return true;
  }
  const mem = t?.filters?.dimensions?.tsMemorySize ?? "";
  const memGB = Number.parseInt(mem);
  const minGB = Number.parseInt(config.minMemory);
  return memGB >= minGB;
};

export const meetsPrice = (config: ModelConfig) => (t: Tile) => {
  if (config.maxPrice === undefined) {
    return true;
  }

  return Number.parseFloat(t.price.currentPrice.raw_amount) <= config.maxPrice;
};
