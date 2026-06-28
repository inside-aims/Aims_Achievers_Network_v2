import { cookies } from "next/headers";
import XolacePromoRibbonClient from "./xolace-promo-ribbon-client";

// Bump this to re-introduce the ribbon to everyone (overrides past dismissals).
export const PROMO_VERSION = "v1";

const XolacePromoRibbon = async () => {
  const store = await cookies();
  const dismissed = store.get("xolace_promo")?.value === PROMO_VERSION;
  if (dismissed) return null;

  return <XolacePromoRibbonClient version={PROMO_VERSION} />;
};

export default XolacePromoRibbon;
