import NominationProcess from "@/components/features/nominations/nomination-process";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Nominations',
  description:
    'Submit and manage award nominations through a transparent and structured process designed to recognize outstanding individuals, teams, and achievements.',
}

import { Suspense } from "react";

const NominationsPage = () => {
  return(
    <div id={"nominations"} className={"feature"}>
      <Suspense fallback={<div className="flex h-[50vh] items-center justify-center">Loading nomination process...</div>}>
        <NominationProcess/>
      </Suspense>
    </div>
  )
}
export default NominationsPage