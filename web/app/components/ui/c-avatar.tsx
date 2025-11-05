import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface CAvatarProps {
  src: string;
  alt: string;
}

const CAvatar = ({ src, alt }: CAvatarProps) => {
  return (
    <Avatar className="h-8 w-8 rounded-4xl">
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    </Avatar>
  );
};

export default CAvatar;
