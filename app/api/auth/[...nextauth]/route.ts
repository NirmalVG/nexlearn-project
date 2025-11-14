import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.accessToken || !credentials?.user) {
          return null
        }

        try {
          const parsedUser = JSON.parse(credentials.user)

          return {
            id: parsedUser.id || "1",
            name: parsedUser.name,
            email: parsedUser.email,
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            ...parsedUser,
          }
        } catch (e) {
          console.error("Error parsing user data in authorize:", e)
          return null
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
