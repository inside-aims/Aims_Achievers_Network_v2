import { redirect } from "next/navigation"

export default async function NewEventRedirectPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params
  redirect(`/user/${uuid}/new-event`)
}
