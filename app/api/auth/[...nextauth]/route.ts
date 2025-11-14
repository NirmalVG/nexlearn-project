import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      id: "otp-login",
      name: "OTP Login",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        user: { label: "User Data", type: "text" },
      },
      async authorize(credentials) {
        console.log("Authorize credentials:", {
          hasAccessToken: !!credentials?.accessToken,
          user: credentials?.user,
        })

        if (!credentials?.accessToken) {
          console.error("Authorize failure: Missing accessToken")
          return null
        }

        let parsedUser = {}

        if (credentials.user) {
          try {
            parsedUser = JSON.parse(credentials.user)
          } catch (e) {
            console.warn("Authorize warning: Could not parse user JSON", e)
            parsedUser = credentials.user as any
          }
        }

        return {
          id: (parsedUser as any).id || "default-user-id",
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          user: parsedUser,
          ...parsedUser,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userData = user
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      session.user = token.userData
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
