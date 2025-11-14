import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface CAvatarProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
}

const CAvatar = ({ src, alt, width, height }: CAvatarProps) => {
  return (
    <Avatar
      className={`${width ? width : "w-8"} ${
        height ? height : "h-8"
      }   rounded-full`}
    >
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="rounded-full">CN</AvatarFallback>
    </Avatar>
  );
};

export default CAvatar;
