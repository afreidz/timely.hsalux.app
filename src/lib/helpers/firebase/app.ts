import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD9iqwGIxGR8pVHgQLliN8ZLMTz35GzHZA",
  authDomain: "timedotme.firebaseapp.com",
  projectId: "timedotme",
  storageBucket: "timedotme.appspot.com",
  messagingSenderId: "881474714465",
  appId: "1:881474714465:web:c733b06f57c1f846e36320",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export default app;
