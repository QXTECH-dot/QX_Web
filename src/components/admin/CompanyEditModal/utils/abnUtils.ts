export const formatABN = (abn: string): string => {
  const cleanABN = abn.replace(/\D/g, "");
  if (cleanABN.length !== 11) return abn;

  return cleanABN.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
};

export const getCleanABN = (abn: string): string => {
  return abn.replace(/\D/g, "");
};

export const validateABN = (abn: string): boolean => {
  const cleanABN = getCleanABN(abn);
  return cleanABN.length === 11;
};
