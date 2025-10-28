"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { rotasPublicas } from "../utils/lists";

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

  return <>{children}</>;
}
