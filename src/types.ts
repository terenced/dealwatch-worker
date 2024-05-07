// Generated by https://transform.tools/json-to-typescript
// Manually stripped out the things I did not need.

export interface ScriptContent {
  tiles: Tile[];
  [key: string]: unknown;
}

export interface Tile {
  productDetailsUrl: string;
  price: Price;
  title: string;
  partNumber: string;
  filters: { dimensions: Dimensions };
  image: Image;
  lob: string;
}

export interface CurrentPrice {
  amount: string;
  raw_amount: string;
}
export interface PreviousPrice extends CurrentPrice {
  previousPrice: string;
}

export interface Dimensions {
  dimensionCapacity?: string;
  refurbClearModel: string;
  dimensionRelYear: string;
  dimensionColor?: string;
  tsMemorySize?: string;
  dimensionScreensize?: string;
}
export interface Price {
  priceFeeDisclaimer: string;
  previousPrice?: PreviousPrice;
  savings?: string;
  priceCurrency: string;
  partNumber: string;
  showItemPropPrice: boolean;
  showItemPropAvailability: boolean;
  showPromoAsIncludes: boolean;
  showPayPal: boolean;
  showDynamicFinancing: boolean;
  chooseDefaultPurchaseOption: boolean;
  originalProductAmount?: number;
  currentPrice: CurrentPrice;
  basePartNumber: string;
  refurbProduct: boolean;
}

export interface Image {
  scaleFactor: string;
  srcSet: { src: string };
  attrs: string;
  alt: string;
  width: string;
  height: string;
  imageName: string;
  originalImageName: string;
  noImage: boolean;
  deferSrc: boolean;
}
