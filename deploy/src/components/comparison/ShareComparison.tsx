"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useComparison } from './ComparisonContext';
import { Share2, Check, Copy, Mail, Link } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function ShareComparison() {
  const { generateSharingUrl } = useComparison();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sharingUrl = generateSharingUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sharingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent('Company Comparison from QX Web');
    const body = encodeURIComponent(`Check out this company comparison I created on QX Web:\n\n${sharingUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <Share2 className="h-4 w-4" />
          Share Comparison
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Company Comparison</DialogTitle>
          <DialogDescription>
            Share this unique URL with others to show the same company comparison.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={sharingUrl}
              className="h-10 w-full rounded-md border"
            />
          </div>
          <Button
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={copyToClipboard}
          >
            <Link className="h-4 w-4" />
            Copy Link
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={shareByEmail}
          >
            <Mail className="h-4 w-4" />
            Share by Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
