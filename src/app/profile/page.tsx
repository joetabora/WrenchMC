import BikeSelector from '@/components/BikeSelector'
import Card from '@/components/ui/Card'

export default function ProfilePage() {
  return (
    <section>
      <h2 className="text-lg font-semibold">Profile</h2>
      <p className="text-sm text-gray-600">Save your primary bike to filter searches and use voice queries hands-free.</p>
      <div className="mt-4">
        <Card className="p-4">
          <BikeSelector />
        </Card>
      </div>
    </section>
  )
}
