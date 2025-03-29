import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
],

  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async redirect({ baseUrl }) {
      // Override the default redirect
      return `${baseUrl}/home`;
    }
  }
})