import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface CAvatarProps {
  src?: string;
  alt: string;
  width?: string;
  height?: string;
}

const CAvatar = ({ src, alt, width, height }: CAvatarProps) => {
  return (
    <Avatar className={`${width ?? "w-8"} ${height ?? "h-8"} rounded-full`}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="rounded-full">CH</AvatarFallback>
    </Avatar>
  );
};

export default CAvatar;
