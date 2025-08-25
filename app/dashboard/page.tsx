import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  // Later this will be replaced with proper Supabase auth check

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}
