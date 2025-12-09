"use client";

import { cn } from "@/app/lib/utils";
import { Card, CardContent } from "@/app/components/ui/card";
import { FieldDescription } from "@/app/components/ui/field";
import Link from "next/link";

interface UsuarioTemplateProps {
  children: React.ReactNode;
  props?: any;
  className?: string;
}

const UsuarioTemplate = ({
  children,
  props,
  className,
}: UsuarioTemplateProps) => {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid w-full p-0 md:grid-cols-2">
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {children}
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Desenvolvido por{" "}
        <Link target="_blank" href="https://github.com/lucaszamorapy">
          Lucas Zamora
        </Link>
      </FieldDescription>
    </div>
  );
};

export default UsuarioTemplate;
