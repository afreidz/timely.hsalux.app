import * as msal from "@azure/msal-browser";
import type { AccountInfo } from "@azure/msal-browser";

export interface IUser {
  uid: string;
  email: string;
  token?: string;
}

const clientId = import.meta.env.AC_AUTH_CLIENT_ID;
const scopes = [import.meta.env.AC_AUTH_SCOPE_URL];
const authority = import.meta.env.AC_AUTH_AUTHORITY_URL;
const redirectUri = import.meta.env.AC_AUTH_REDIRECT || window.location.origin;

const auth = new msal.PublicClientApplication({
  auth: {
    clientId,
    authority,
    redirectUri,
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
