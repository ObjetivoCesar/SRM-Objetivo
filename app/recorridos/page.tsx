import { RecorridosLayout } from "@/components/recorridos/recorridos-layout"

export default async function RecorridosPage({ searchParams }: { searchParams: { leadId: string } }) {
  const { leadId } = searchParams
  return <RecorridosLayout leadId={leadId} />
}
