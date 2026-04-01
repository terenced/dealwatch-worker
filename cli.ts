import { parseArgs } from "node:util";
import { defaultConfig } from "./src/config";
import { fetchMacs } from "./src/fetchMac";

const { values } = parseArgs({
  options: {
    model: { type: "string", short: "m", multiple: true },
    maxPrice: { type: "string", short: "p" },
    minMemory: { type: "string" },
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
