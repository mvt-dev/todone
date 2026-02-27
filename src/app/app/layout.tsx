import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Navigation from './navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session: any = await auth()

  if (!session) {
    return redirect('/signin')
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="pb-14 min-h-full">
        {children}
      </div>
      <Navigation />
    </div>
  )
}