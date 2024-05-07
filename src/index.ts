import { HTMLScriptElement, parseHTML } from "linkedom";
import { MessageBuilder } from "./discord/message-builder";
import { createHook } from "./discord/webhook";
import { isM2, isMacMini, targetCapacity } from "./filters";
import type { ScriptContent, Tile } from "./types";

async function fetchData() {
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

async function isActive(env: Env) {
  const activeVal = await env.KV.get("active");
  return activeVal === "true";
}

const format = (t: Tile) => ({
  title: t?.title,
  ...t?.filters?.dimensions,
  price: Number.parseFloat(t?.price?.currentPrice?.raw_amount),
  priceStr: t?.price?.currentPrice?.raw_amount,
  productDetailsUrl: `https://www.apple.com${t?.productDetailsUrl}`,
});

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    try {
      const active = await isActive(env);
      if (!active) {
        return;
      }

      const data = await fetchData();
      const macMinis = data.tiles
        .filter(isMacMini)
        .filter(isM2)
        .filter(targetCapacity)
        .map(format);

      if (macMinis.length === 0) {
        return;
      }

      const hook = createHook(env);

      for (const macMini of macMinis) {
        const embed = new MessageBuilder()
          .setTitle(macMini.title)
          .setURL(macMini.productDetailsUrl)
          .setColor("#fb31a5")
          .setText(
            `${macMini.priceStr} - ${macMini.tsMemorySize} - ${macMini.dimensionCapacity}`,
          )
          .setTimestamp();

        await hook.send(embed);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
