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
          throw new Error('Email and password are required')
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          // Create new user if signing up
          const hashedPassword = await bcrypt.hash(password, 10)
          const newUser = await prisma.user.create({
            data: {
              email,
              name: email.split('@')[0],
            },
          })
          
          // Store password hash in Account table (for credentials provider)
          await prisma.account.create({
            data: {
              userId: newUser.id,
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: newUser.id,
              // Store hashed password in access_token field (temporary solution)
              // In production, you might want a separate Password model
              access_token: hashedPassword,
            },
          })

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          }
        }

        // Verify password for existing users
        const account = await prisma.account.findFirst({
          where: {
            userId: user.id,
            provider: 'credentials',
          },
        })

        if (!account?.access_token) {
          // User exists but no password set - create account with password
          const hashedPassword = await bcrypt.hash(password, 10)
          await prisma.account.create({
            data: {
              userId: user.id,
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: user.id,
              access_token: hashedPassword,
            },
          })
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        }

        // Verify password
        const passwordValid = await bcrypt.compare(password, account.access_token)
        if (!passwordValid) {
          throw new Error('Invalid email or password')
        }

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
    async signIn({ user, account, profile }) {
      // Allow all sign-ins
      return true
    },
    async session({ session, user }: any) {
      // For database strategy, user is passed directly from adapter
      if (user?.id) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true },
        })
        if (dbUser) {
          session.user.role = dbUser.role as string
          session.user.verified = dbUser.verified as boolean
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

