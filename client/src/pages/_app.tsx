import type { AppProps } from 'next/app';
import 'antd/dist/antd.css';
import Head from 'next/head';
import React from 'react';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
    <>
        <Head>
            <link rel="shortcut icon" href="/images/favicon.ico" />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png"
            />
        </Head>
        <Component {...pageProps} />
    </>
);

export default MyApp;
