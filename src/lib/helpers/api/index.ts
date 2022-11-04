import auth from "../../stores/auth";
import error from "../../stores/error";

const headers = new Headers();
const apibase = "http://localhost:3000";
headers.set("Content-Type", "application/json");

auth.subscribe((auth) => {
  if (auth?.token) headers.set("Authorization", `Bearer ${auth.token}`);
});

async function call(path: string, method: string = "GET", data?: object) {
  const url = new URL(path, apibase);
  const body = data ? JSON.stringify(data) : null;
  console.log(method, "API call to:", url.href, "With body:", body);

  const resp = await fetch(url.href, { method, headers, body })
    .then((resp) => {
      if (resp.status === 401) {
        auth.update(() => null);
        error.update(() => "Unauthorized");
        throw new Error("unauthorized");
      }
      return resp;
    })
    .catch((err) => {
      error.update(() => err);
      return err;
    });

  if (resp instanceof Error) {
    throw new Error(resp.message);
  }

  return resp.json?.();
}

export { call };
