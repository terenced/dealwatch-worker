import type { Config } from "./config";
import { defaultConfig } from "./config";
import { MessageBuilder } from "./discord/message-builder";
import { createHook } from "./discord/webhook";
import { fetchMacs } from "./fetchMacs";

async function isActive(env: Env) {
  const activeVal = await env.KV.get("active");
  return activeVal === "true";
}

async function getConfig(env: Env): Promise<Config> {
  const raw = await env.KV.get("config");
  if (!raw) return defaultConfig;
  return JSON.parse(raw) as Config;
}

export default {
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    try {
      const active = await isActive(env);
      if (!active) {
        console.log("not active");
        return;
      }

      const config = await getConfig(env);
      const { macMini, macStudio, macBookPro } = await fetchMacs(config);
      const allDeals = [...macMini, ...macStudio, ...macBookPro];

      if (allDeals.length === 0) {
        return;
      }

      const hook = createHook(env);

      for (const deal of allDeals) {
        const embed = new MessageBuilder()
          .setTitle(deal.title)
          .setURL(deal.productDetailsUrl)
          .setColor("#fb31a5")
          .setText(
            `${deal.priceStr} - ${deal.tsMemorySize} - ${deal.dimensionCapacity}`,
          )
          .setTimestamp();

        await hook.send(embed);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
