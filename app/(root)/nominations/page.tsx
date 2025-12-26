import NominationProcess from "@/components/features/nominations/nomination-process";
import {Metadata} from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'Nominations',
  description:
    'Submit and manage award nominations through a transparent and structured process designed to recognize outstanding individuals, teams, and achievements.',
}

const NominationsPage = () => {
  return(
    <div id={"nominations"} className={"feature"}>
      <Suspense fallback={<div>Loading...</div>}>
        <NominationProcess/>
      </Suspense>
    </div>
  )
}
export default NominationsPage