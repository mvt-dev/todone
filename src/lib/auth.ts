import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'

const config = {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db('user').where('username', credentials.username).first()
        
        if (!user) {
          return null
        }

        const isValidPassword = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          username: user.username
        }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user
      const isOnApp = nextUrl.pathname.startsWith('/app')

      if (isOnApp) {
        if (isLoggedIn) return true
        return false // Redirect to signin
      }

      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }: any) {
      if (token.username) {
        session.user = {
          id: token.sub!,
          username: token.username as string
        }
      }
      return session
    }
  }
} satisfies NextAuthConfig

export const { auth, signIn, signOut } = NextAuth(config)
