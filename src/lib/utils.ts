import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// 验证ABN是否有效
// 澳大利亚商业号码(ABN)通常是11位数字
export function isValidABN(abn: string): boolean {
  // 去除所有非数字字符
  const cleanABN = cleanABNNumber(abn);
  
  // 检查是否是11位数字
  if (cleanABN.length !== 11) {
    console.log(`ABN validation failed for: ${abn}, cleaned to: ${cleanABN}, length: ${cleanABN.length}`);
    return false;
  }
  
  // 基本检查：只包含数字
  const isValid = /^\d{11}$/.test(cleanABN);
  console.log(`ABN validation for ${abn}: ${isValid}`);
  return isValid;
}

/**
 * 清理ABN号码，移除所有非数字字符
 * @param abn 原始ABN号码，可能包含空格或其他分隔符
 * @returns 清理后的纯数字ABN
 */
export function cleanABNNumber(abn: string | null | undefined): string {
  if (!abn) return '';
  // 去除所有非数字字符
  return abn.replace(/[^0-9]/g, '');
}
