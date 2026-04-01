import { HTMLScriptElement, parseHTML } from "linkedom";
import type { Config } from "./config";
import {
  isMacBookBro,
  isMacMini,
  isMacStudio,
  meetsMemory,
  meetsPrice,
} from "./filters";
import type { ScriptContent, Tile } from "./types";

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

  if (!scriptContent) {
    return null;
  }
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

export async function fetchMacs(config: Config) {
  const data = await fetchPageData();
  const tiles = data?.tiles ?? [];

  const macMini = config.macMini.enabled
    ? tiles
        .filter(isMacMini)
        .filter(meetsMemory(config.macMini))
        .filter(meetsPrice(config.macMini))
        .map(formatData)
    : [];

  const macStudio = config.macStudio.enabled
    ? tiles
        .filter(isMacStudio)
        .filter(meetsMemory(config.macStudio))
        .filter(meetsPrice(config.macStudio))
        .map(formatData)
    : [];

  const macBookPro = config.macBookPro.enabled
    ? tiles
        .filter(isMacBookBro)
        .filter(meetsMemory(config.macBookPro))
        .filter(meetsPrice(config.macBookPro))
        .map(formatData)
    : [];

  return { macMini, macStudio, macBookPro };
}
