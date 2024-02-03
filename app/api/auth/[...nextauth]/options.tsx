import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        {
            id: "lightspeed",
            name: "Lightspeed",
            type: "oauth",
            token: "https://cloud.lightspeedapp.com/oauth/access_token.php",
            userinfo: "https://api.lightspeedapp.com/API/V3/Account.json",
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
            profile(profile: any) {
                return {
                    id: profile.Account.accountID,
                    name: profile.Account.name,
                }
            },
            clientId: process.env.LIGHTSPEED_CLIENT_ID as string,
            clientSecret: process.env.LIGHTSPEED_CLIENT_SECRET as string,
        }

    ],
}
