'use server'
 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth, signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import db from '@/lib/db'
 
export async function signin(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData, { redirectTo: '/app' })
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function signout() {
  const cookieStore = await cookies()
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.includes('authjs')) {
      cookieStore.delete(cookie.name)
    }
  })
  redirect('/')
}

export async function userIsActive() {
  const session = await auth()
  const user = await db('user').where('id', session?.user?.id).first()
  return !!user
}
