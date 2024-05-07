import { fetchMinis } from "./src/fetchData";

const minis = await fetchMinis();

if (minis.length === 0) {
  console.log("No mac minis found for you 😔\n\n");
}

for (const mini of minis) {
  console.log(mini.title);
  console.log(
    `${mini.priceStr} - ${mini.tsMemorySize} - ${mini.dimensionCapacity}`,
  );
  console.log(mini.productDetailsUrl);
}
