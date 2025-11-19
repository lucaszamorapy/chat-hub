"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { rotasPublicas } from "../utils/lists";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "./ui/breadcrumb";

export default function ProtecaoRota({
  children,
  token,
}: {
  children: React.ReactNode;
  token?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token && !rotasPublicas.includes(pathname)) {
      router.push("/login");
    }
    if (token && rotasPublicas.includes(pathname)) {
      router.push("/");
    }
  }, [pathname, token, router]);

  if (rotasPublicas.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "400px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground text-base font-medium">
                  Chat <span className="text-primary">Hub</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2">
          <div className="bg-muted/50 aspect-video h-full w-full rounded-lg">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
