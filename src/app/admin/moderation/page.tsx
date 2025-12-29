import { supabaseServer } from '@/lib/supabaseServer'
import SpecCard from '@/components/SpecCard'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default async function ModerationPage() {
  const { data } = await supabaseServer.from('specs').select('*').eq('approved', false).limit(50)
  const specs = data || []

  return (
    <section>
      <h2 className="text-lg font-semibold">Moderation Queue</h2>
      <p className="text-sm text-gray-600">Approve or reject community-submitted specs.</p>

      <div className="mt-4 space-y-4">
        {specs.map((s: any) => (
          <Card key={s.id} className="flex gap-4 items-start p-3">
            <div className="flex-1"><SpecCard spec={s} /></div>
            <div className="space-y-2">
              <form action={`/api/admin/approve`} method="post">
                <input type="hidden" name="id" value={s.id} />
                <Button type="submit" className="bg-green-600">Approve</Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
