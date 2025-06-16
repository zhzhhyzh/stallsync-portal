import "../styles/globals.css";
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "@app/redux/store";
import Layout from "@app/components/@Layout/Layout";
import Head from "next/head";

import { RouteGuard } from "@app/components/RouteGuard";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <RouteGuard>
        <Layout>
          <Head><title>Go-Agent</title></Head>
          <Component {...pageProps} />
        </Layout>
      </RouteGuard>
    </Provider>
  );
}
