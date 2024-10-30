export const formatCurrency = (value: string) => {
  const number = parseFloat(value.replace(/\D/g, "")) / 100;
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatReal = (value: number) => {
  const real = new Intl.NumberFormat("pt-br", {
    currency: "BRL", style: "currency"
  }).format(value);

  return real;
} 