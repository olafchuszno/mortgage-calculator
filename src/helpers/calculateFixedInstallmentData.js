export const calculateFixedInstallmentData = (
  totalAmount,
  totalInstallments,
  roundedInstallment,
  monthlyInterest
) => {
  const data = [[0, totalAmount, 0, 0, 0, totalAmount]];

  for (let i = 1; i <= totalInstallments; i++) {
    const installmentNumber = i;
    const startValue = data[i - 1][5];
    let installment = roundedInstallment;
    const interest = Math.ceil(data[i - 1][5] * monthlyInterest * 100) / 100;
    let capital = Math.round((installment - interest) * 100) / 100;
    let finalValue = Math.round((startValue - capital) * 100) / 100;

    if (i === totalInstallments) {
      installment += finalValue;
      capital += finalValue;
      finalValue = 0;
    }

    data.push([
      installmentNumber,
      startValue,
      installment,
      interest,
      capital,
      finalValue,
    ]);
  }

  return data;
};
