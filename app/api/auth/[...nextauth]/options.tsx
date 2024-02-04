import { DefaultSession, NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// nextauth.d.ts
declare module "next-auth" {
  interface User {
    systemUserID: string;
    shopName: string;
    shopAccountID: string;
  }

  interface Session extends DefaultSession {
    user?: User;
    accessToken?: string;
    expires_in?: number;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: "lightspeed",
      name: "Lightspeed",
      type: "oauth",
      token: "https://cloud.lightspeedapp.com/oauth/access_token.php",
      userinfo: "https://api.lightspeedapp.com/API/V3/Session.json",
      authorization: {
        url: "https://cloud.lightspeedapp.com/oauth/authorize.php",
        params: {
          response_type: "code",
          scope: "employee:all",
          client_id: process.env.LIGHTSPEED_CLIENT_ID as string,
        },
      },
      idToken: false,
      checks: ["pkce", "state"],
      profile(profile: any, tokens: any) {
        console.log("profile", profile);
        return {
          id: profile.employeeID as string,
          systemUserID: profile.systemUserID as string,
          name: `${profile.Employee.firstName} ${profile.Employee.lastName}` as string,
          email: profile.systemUserLogin as string,
          image: `https://robohash.org/${profile.systemUserID}.png`,
          shopName: profile.systemCustomerName as string,
          shopAccountID: profile.systemCustomerID as string,
        };
      },
      clientId: process.env.LIGHTSPEED_CLIENT_ID as string,
      clientSecret: process.env.LIGHTSPEED_CLIENT_SECRET as string,
    },
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: any;
      user: any;
    }) {
      if (session.user) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log("jwt");
      if (account && user) {
        // user is the profile returned from the profile callback
        return {
          accessToken: account.access_token,
          accessTokenExpires:
            Date.now() + (account.expires_in as number) * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < ((token.accessTokenExpires as number) ?? 0)) {
        console.log(
          `No need to refresh token, ${
            (token.accessTokenExpires as number) - Date.now()
          } miliseconds left`
        );
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
  },
};

async function refreshAccessToken(token: any) {
  try {
    console.log("Refreshing access token");
    const url = "https://cloud.lightspeedapp.com/oauth/access_token.php";

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.LIGHTSPEED_CLIENT_ID as string,
        client_secret: process.env.LIGHTSPEED_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log("refreshedTokens", refreshedTokens);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires:
        Date.now() + (refreshedTokens.expires_in as number) * 1000,
      refreshToken: token.refreshToken,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
