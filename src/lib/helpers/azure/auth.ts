import * as msal from "@azure/msal-browser";
import type { AccountInfo } from "@azure/msal-browser";
const scopes = ["api://e3e6d70e-ff2b-4c9a-b773-1bd7d9919593/access_as_user"];

export interface IUser {
  uid: string;
  email: string;
  token?: string;
}

const auth = new msal.PublicClientApplication({
  auth: {
    clientId: "cffe5dc2-3399-4c0b-b755-5907434dab58",
    redirectUri: "http://localhost:5173",
    authority:
      "https://login.microsoftonline.com/e85feadf-11e7-47bb-a160-43b98dcc96f1",
  },
});

function signin() {
  auth.loginRedirect();
}

async function onAuthChange(callback: (user: IUser) => void) {
  const auth: IUser | null = await getAuth();
  callback?.(auth);
}

async function getAuth() {
  const response = await auth.handleRedirectPromise();
  let account: AccountInfo;

  if (response) account = response.account;

  const accounts = auth.getAllAccounts();

  if (accounts.length > 1) console.warn("multiple azure acocunts detected");
  if (!accounts || accounts.length === 0) return;

  account = accounts[0];

  const tokenResponse = await auth
    .acquireTokenSilent({
      account,
      scopes,
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof msal.InteractionRequiredAuthError) {
        auth.acquireTokenRedirect({
          account,
          scopes,
        });
        return null;
      }
    });

  if (!tokenResponse.accessToken) return null;

  return {
    email: account.username,
    uid: account.localAccountId,
    token: tokenResponse?.accessToken,
  };
}

function signout(user: string) {
  const request = { account: auth.getAccountByUsername(user) };
  auth.logoutRedirect(request);
}

export { signin, onAuthChange, signout, getAuth };
