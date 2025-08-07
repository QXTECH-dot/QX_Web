import React from 'react';
import Image from 'next/image';

interface BlogAuthorProps {
  name: string;
  avatar?: string;
  role?: string;
}

export function BlogAuthor({ name, avatar = "", role = "Content Writer" }: BlogAuthorProps) {
  return (
    <div className="flex items-center mt-8 mb-6 border-t border-b py-4">
      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
        <Image
          src={avatar || "https://ext.same-assets.com/3273624843/3227621684.jpeg"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
}
