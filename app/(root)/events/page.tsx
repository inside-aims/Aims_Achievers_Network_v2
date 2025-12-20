import React from 'react'
import EventsListing from "@/components/features/events/events-listing";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Discover upcoming and past award events, ceremonies, and programs designed to honor excellence across various categories.',
}

const Events = () => {
  return (
    <div id={"events"} className="feature">
      <EventsListing/>
    </div >
  )
}

export default Events