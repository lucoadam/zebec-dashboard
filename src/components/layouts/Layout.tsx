import Head from "next/head"
import React, { FC, useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import Navbar from "./Navbar"
import TPSHeader from "./TPSHeader"

interface LayoutProps {
  pageTitle: string
  children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ pageTitle, children }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setTimeout(() => {
      ReactTooltip.rebuild()
    }, 1500)
  }, [])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="Zebec is a revolutionary DeFi technology that empowers real-time, frictionless and continuous streams of payments."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TPSHeader />
      <Navbar />

      <main
        className={`pb-20 bg-background-secondary-light border-t border-outline dark:bg-background-primary dark:border-[#202021]`}
        style={{ minHeight: "calc(100vh - 108px)" }}
      >
        {children}
      </main>

      {isMounted && (
        <ReactTooltip
          className="!px-2 !py-1 !rounded"
          backgroundColor="#2b2d33fa"
          arrowColor="#2b2d33fa"
          place="bottom"
        />
      )}
    </>
  )
}

export default Layout
