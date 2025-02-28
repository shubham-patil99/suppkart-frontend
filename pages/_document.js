import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import c from "@constants/Common";

export default class CustomDocument extends Document {
  static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context);
    const sheet = new ServerStyleSheet();
    const page = await context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...initialProps, ...page, styleTags, host: context.req ? context.req.hostname : "" };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* DNS Prefetch */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href={c.BASE_URL} />

          {/* Preload Critical Fonts */}
          <link rel="preload" href="https://fonts.googleapis.com/css2?family=Lato:wght@100;200;300;400;500;600;700&display=swap" as="style" />

          {/* Preload images */}
          <link rel="preload" href="https://api.suppkart.com/public/uploads/sliders/6767fd7656932.jpeg" as="image" />
          <link rel="preload" href="https://api.suppkart.com/public/uploads/sliders/6668a175134fc.jpeg" as="image" />

          {/* Stylesheets */}
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
                    <link rel="stylesheet" href={`${c.BASE_URL}/assets/styles/style.css`} />
                    <link rel="stylesheet" href={`${c.BASE_URL}/assets/styles/responsive.css`} />
                    <link rel="stylesheet" href={`${c.BASE_URL}/assets/styles/loader.css`} />

          {/* Favicon */}
          <link rel="shortcut icon" href={`${c.BASE_URL}/assets/images/iconf.png`} />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Suppkart",
                "url": "https://suppkart.com",
                "logo": "https://suppkart.com/assets/icons/logo.svg",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91 9085857070",
                  "contactType": "customer service",
                  "areaServed": "IN",
                  "availableLanguage": ["en"]
                },
                "sameAs": [
                  "https://www.instagram.com/suppkart/",
                  "https://www.facebook.com/people/InfoSuppkart/61558765396477/",
                  "https://suppkart.com"
                ]
              })
            }}
          />


          {/* Google Tag Manager (Head Script) */}
          <script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-596LQ53S');
        `,
            }}
          />


          {/* Meta Tags for SEO */}
          <meta name="robots" content="noindex, nofollow" />
          {/* <meta name="description" content="Suppkart: Your one-stop shop for high-quality supplements and wellness products." /> */}
        </Head>
        <body>
          {/* Google Tag Manager (Noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-596LQ53S"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>

          {this.props.styleTags}
          <Main />
          <NextScript />

          {/* Bootstrap Bundle JS */}
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" async></script>
        </body>
      </Html>
    );
  }
}
