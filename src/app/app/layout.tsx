import { userIsActive, signout } from '@/actions/auth'
import Navigation from './navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const isActive = await userIsActive()

  if (!isActive) {
    await signout()
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="pb-14 min-h-full max-w-[1000px] mx-auto">
        {children}
      </div>
      <Navigation />
    </div>
  )
}