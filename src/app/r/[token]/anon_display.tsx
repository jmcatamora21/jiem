import AnonPage from "./anon_display"

export default async function Page({ params }: { params: { token: string } }) {
  return <AnonPage params={params}  />
}