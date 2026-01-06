// NextAuth configuration for WrenchMC Goliath
import NextAuth, { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          // Create new user if signing up
          const newUser = await prisma.user.create({
            data: {
              email,
              name: email.split('@')[0],
            },
          })
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          }
        }

        // TODO: Implement proper password hashing/verification
        // For now, allow sign-in for existing users (migrate from Supabase later)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session?.user && user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true },
        })
        if (dbUser) {
          session.user.role = dbUser.role
          session.user.verified = dbUser.verified
        }
      }
      return session
    },
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Export auth function and handlers for NextAuth v5
export const { handlers, auth, signIn, signOut } = NextAuth(config)

