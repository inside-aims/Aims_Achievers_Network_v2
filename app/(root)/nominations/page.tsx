import NominationProcess from "@/components/features/nominations/nomination-process";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Nominations',
  description:
    'Submit and manage award nominations through a transparent and structured process designed to recognize outstanding individuals, teams, and achievements.',
}

const NominationsPage = () => {
  return(
    <div id={"nominations"} className={"feature"}>
      <NominationProcess/>
    </div>
  )
}
export default NominationsPage