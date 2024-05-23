import { mongoDBConnection } from "@/lib/mongodb";
import { WeatherUsers } from "@/models/weatherUsers";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      profile(profile: GithubProfile): any {
        return {
          ...profile,
          name: profile?.name ?? "",
          role: profile.role ?? "",
          employmentType: profile.employmentType ?? "",
          id: profile.id.toString(),
          image: profile.avatar_url,
        };
      },
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any, req) {
        return credentials;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/weather",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "github" || account?.provider === "google") {
        await mongoDBConnection();
        try {
          const existingUser = await WeatherUsers.findOne({
            email: user.email,
          });

          if (!existingUser) {
            await WeatherUsers.create({
              name: user?.name,
              email: user?.email,
              emailVerified: new Date(),
            });
            return true;
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },
  },
};
