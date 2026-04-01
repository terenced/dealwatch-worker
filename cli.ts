import { parseArgs } from "node:util";
import { defaultConfig } from "./src/config";
import { MessageBuilder } from "./src/discord/message-builder";
import { Webhook } from "./src/discord/webhook";
import { fetchMacs } from "./src/fetchMacs";

const { values } = parseArgs({
  options: {
    model: { type: "string", short: "m", multiple: true },
    maxPrice: { type: "string", short: "p" },
    minMemory: { type: "string" },
    discord: { type: "string", short: "d" },
  },
});

const modelKeys = ["macMini", "macStudio", "macBookPro"] as const;

const config: any = {};
for (const key of modelKeys) {
  config[key] = { ...defaultConfig[key] };

  if (values.model) {
    config[key].enabled = values.model.includes(key);
  }

  if (config[key].enabled) {
    if (values.maxPrice) {
      config[key].maxPrice = Number.parseFloat(values.maxPrice);
    }
    if (values.minMemory) {
      config[key].minMemory = values.minMemory;
    }
  }
}

const { macMini, macStudio, macBookPro } = await fetchMacs(config);
const allDeals = [...macMini, ...macStudio, ...macBookPro];

if (allDeals.length === 0) {
  console.log("No deals found for you 😔\n\n");
}

for (const deal of allDeals) {
  console.log(deal.title);
  console.log();
  console.log(
    `${deal.priceStr} - ${deal.tsMemorySize} - ${deal.dimensionCapacity}`,
  );
  console.log();
  console.log(deal.productDetailsUrl);
}

if (values.discord && allDeals.length > 0) {
  const hook = new Webhook(values.discord);

  for (const deal of allDeals) {
    const embed = new MessageBuilder()
      .setTitle(deal.title)
      .setURL(deal.productDetailsUrl)
      .setColor("#fb31a5")
      .setText(
        `${deal.priceStr} - ${deal.tsMemorySize} - ${deal.dimensionCapacity}`,
      )
      .setTimestamp();

    const image = deal.image.sources.at(0)?.srcSet ?? "";
    embed.setImage(image);

    await hook.send(embed);
  }

  console.log(`\nSent ${allDeals.length} deal(s) to Discord.`);
}
