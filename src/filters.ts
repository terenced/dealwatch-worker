import type { Tile } from "./types";

export const isMacMini = (t: Tile) =>
  t?.filters?.dimensions?.refurbClearModel === "macmini";

export const isMacStudio = (t: Tile) =>
  t?.filters?.dimensions?.refurbClearModel === "macstudio";

export const isM2 = (t: Tile) =>
  t?.title?.includes("M2 Chip") || t?.title?.includes("M2 Pro");

export const targetMemory = (t: Tile) =>
  t?.filters?.dimensions?.tsMemorySize !== "8gb";

export const targetCapacity = (t: Tile) =>
  t?.filters?.dimensions?.dimensionCapacity !== "256gb";

export const targetPrice = (t: Tile) =>
  Number.parseFloat(t.price.currentPrice.raw_amount) < 1200;
