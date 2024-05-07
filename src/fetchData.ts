import { HTMLScriptElement, parseHTML } from "linkedom";
import type { ScriptContent, Tile } from "./types";
import {
  isMacMini,
  isM2,
  targetCapacity,
  targetPrice,
  targetMemory,
} from "./filters";

export async function fetchPageData() {
  const url = "https://www.apple.com/ca/shop/refurbished/mac/mac-mini";
  const text = await fetch(url).then((res) => res.text());
  const { document } = parseHTML(text);
  const scriptTags = document.getElementsByTagName(
    "script",
  ) as HTMLScriptElement[];

  const scriptContent = Array.from(scriptTags)
    ?.filter((t) => t.innerText.includes("window.REFURB_GRID_BOOTSTRAP"))?.[0]
    ?.innerHTML?.trim()
    ?.replace("window.REFURB_GRID_BOOTSTRAP =", "")
    ?.replace(";", "");

  const data = JSON.parse(scriptContent) as unknown as ScriptContent;
  return data;
}

export const formatData = (t: Tile) => ({
  title: t?.title,
  ...t?.filters?.dimensions,
  price: Number.parseFloat(t?.price?.currentPrice?.raw_amount),
  priceStr: t?.price?.currentPrice?.raw_amount,
  productDetailsUrl: `https://www.apple.com${t?.productDetailsUrl}`,
});

export async function fetchMinis() {
  const data = await fetchPageData();

  return data?.tiles
    .filter(isMacMini)
    .filter(isM2)
    .filter(targetCapacity)
    .filter(targetMemory)
    .filter(targetPrice)
    .map(formatData);
}
