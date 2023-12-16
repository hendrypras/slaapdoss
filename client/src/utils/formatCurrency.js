const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return value ? formatter.format(value) : '0';
};

export default formatCurrency;
