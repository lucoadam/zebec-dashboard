import { ReactElement } from "react"
import Document, {
  Html,
  Head,
  Main,
  NextScript
  //   DocumentContext,
  //   DocumentInitialProps,
} from "next/document"

class CustomDocument extends Document {
  //   static async getInitialProps(
  //     ctx: DocumentContext,
  //   ): Promise<DocumentInitialProps> {
  //     const initialProps = await Document.getInitialProps(ctx);
  //     return { ...initialProps };
  //   }
  render(): ReactElement {
    return (
      <Html>
        <Head>
          {/* Inter */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
