import {Metadata} from "next";
import OutletsListing from "@/components/features/outlets/outlets-listing";

export const metadata: Metadata = {
  title: 'Outlets',
  description: "Browse trusted outlets selling award plaques and trophies. View their work and contact them instantly.",
}

const OutletsPage = () => {
  return(
    <div id={"outlets"} className={"feature"}>
      <OutletsListing/>
    </div>
  )
}
export default OutletsPage