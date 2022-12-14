import { GuestLayout } from "@hadmean/chromista";
import React, { ReactNode } from "react";
import Head from "next/head";
import { useSiteConfig } from "../../hooks/app/site.config";
import { useAppTheme } from "../useAppTheme";
import { GoogleTagManager } from "../scripts/GoogleTagManager";

interface IProps {
  children: ReactNode;
  title: string;
  subTitle: string;
}

export function AuthLayout({ children, title, subTitle }: IProps) {
  const siteConfig = useSiteConfig();
  useAppTheme();

  return (
    <GuestLayout
      title={title}
      subTitle={subTitle}
      appDetails={{ ...siteConfig, logo: siteConfig.fullLogo }}
    >
      <Head>
        <title>
          {title} - {siteConfig.name}
        </title>
      </Head>
      {children}
      <GoogleTagManager />
    </GuestLayout>
  );
}
