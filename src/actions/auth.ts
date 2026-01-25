'use server'
 
import { signIn, signOut } from '@/lib/auth'
import { AuthError } from 'next-auth'
 
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
  await signOut({ redirectTo: '/' })
}
