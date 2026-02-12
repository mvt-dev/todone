import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AppPage() {
  const session: any = await auth()

  redirect('/app/todo')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to your app</h1>
      <p className="text-gray-600">This is a protected page. You are signed in as {session.user?.username}</p>
    </div>
  )
}
