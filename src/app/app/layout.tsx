import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session: any = await auth()

  if (!session) {
    return redirect('/signin')
  }

  return (
    <div className="h-screen bg-gray-50">
      {children}
    </div>
  )
}