import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Generate username from email
          const baseUsername = user.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
          let username = baseUsername
          let counter = 1

          // Ensure unique username
          while (await db.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`
            counter++
          }

          // Create user with profile
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              username,
              profile: {
                create: {
                  title: user.name || username,
                },
              },
            },
          })
        } else if (!existingUser.username) {
          // Update existing user with username if missing
          const baseUsername = user.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')
          let username = baseUsername
          let counter = 1

          while (await db.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`
            counter++
          }

          await db.user.update({
            where: { id: existingUser.id },
            data: { username },
          })
        }
      }
      return true
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.username = token.username as string
      }

      return session
    },
    async jwt({ token, user, account }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email!,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        username: dbUser.username,
      }
    },
  },
}
