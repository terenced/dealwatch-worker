import { MessageBuilder } from "./discord/message-builder";
import { createHook } from "./discord/webhook";
import { fetchMinis } from "./fetchData";

async function isActive(env: Env) {
  const activeVal = await env.KV.get("active");
  return activeVal === "true";
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
        return;
      }

      const macMinis = await fetchMinis();

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
