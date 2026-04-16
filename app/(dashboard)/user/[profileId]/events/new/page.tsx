import { redirect } from "next/navigation"

export default async function NewEventRedirectPage({
  params,
}: {
  params: Promise<{ profileId: string }>
}) {
  const { profileId } = await params
  redirect(`/user/${profileId}/new-event`)
}
