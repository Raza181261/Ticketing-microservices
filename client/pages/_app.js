import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
import Head from "next/head";
import "../styles/global.css";

const appComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="app-shell">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0A0E1A" />
        <title>GitTix | FIFA World Cup 2026</title>
      </Head>
      <Header currentUser={currentUser} />
      <div className="container app-content">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
};

appComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser,
    );
  }

  console.log(pageProps);
  return {
    pageProps,
    ...data,
  }
};

export default appComponent;
