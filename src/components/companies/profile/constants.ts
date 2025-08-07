// 语言选项常量
export const languageOptions = [
  { value: "en", label: "English" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ar", label: "Arabic" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "th", label: "Thai" },
  { value: "vi", label: "Vietnamese" },
  { value: "id", label: "Indonesian" },
  { value: "ms", label: "Malay" },
  { value: "tl", label: "Filipino" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "ur", label: "Urdu" },
  { value: "bn", label: "Bengali" },
  { value: "pa", label: "Punjabi" },
  { value: "ml", label: "Malayalam" },
  { value: "kn", label: "Kannada" },
  { value: "gu", label: "Gujarati" },
];

// 语言代码转换为全名的函数
export const getLanguageDisplayName = (langCode: string) => {
  const lang = languageOptions.find((l) => l.value === langCode);
  return lang ? lang.label : langCode;
};

// 处理语言数组显示
export const formatLanguages = (languages: string | string[] | undefined) => {
  if (!languages) return "N/A";
  if (typeof languages === "string") {
    return getLanguageDisplayName(languages);
  }
  if (Array.isArray(languages)) {
    return languages.map(getLanguageDisplayName).join(", ");
  }
  return "N/A";
};
