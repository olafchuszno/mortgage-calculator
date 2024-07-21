import "./App.css";
import { useMemo, useState } from "react";

function App() {
  const [interest, setInterest] = useState(0.1);
  const [totalInstallments, setTotalInstallments] = useState(120);
  const [totalAmount, setTotalAmount] = useState(500000);

  const monthlyInterest = useMemo(() => interest / 12, [interest]);

  const singleInstallmentAmount = useMemo(() => {
    return (
      (totalAmount *
        monthlyInterest *
        (1 + monthlyInterest) ** totalInstallments) /
      ((1 + monthlyInterest) ** totalInstallments - 1)
    );
  }, [monthlyInterest, totalAmount, totalInstallments]);

  const roundedInstallment = useMemo(
    () => Math.round(singleInstallmentAmount * 100) / 100,
    [singleInstallmentAmount]
  );

  const headers = [
    "Numer raty",
    "Początkowa wartość",
    "Rata",
    "Odsetki",
    "Kapitał",
    "Wartość końcowa",
  ];

  const installments = [];

  for (let i = 1; i <= totalInstallments; i++) {
    installments.push(i);
  }

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

  return (
    <div className="App">
      <header style={{ marginBottom: "-160px" }} className="App-header">
        <h1>Kalkulator hipoteczny</h1>
      </header>

      <div className="inputs">
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="">Kwota kredytu (zł)</label>
          <input
            id="totalAmount"
            onChange={(event) => {
              event.preventDefault();
              setTotalAmount(event.target.value);
            }}
            value={totalAmount}
            name="interest"
            type="number"
          />
          <p>Kwota kredytu (w zł): {totalAmount}</p>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="">Oprocentowanie nominalne (w %)</label>
          <input
            id="interest"
            onChange={(event) => {
              event.preventDefault();
              setInterest(event.target.value / 100);
            }}
            value={interest * 100}
            name="interest"
            type="number"
          />
          <p>
            Oprocentowanie miesięczne (zaokrąglone w %):{" "}
            {Math.round(monthlyInterest * 10000) / 100}
          </p>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="">Ilość rat (łącznie)</label>
          <input
            id="totalInstallments"
            onChange={(event) => {
              event.preventDefault();
              setTotalInstallments(event.target.value);
            }}
            value={totalInstallments}
            name="totalInstallments"
            type="number"
          />
          <p>Łączna ilość rat (w kredycie): {totalInstallments}</p>
        </div>
      </div>

      <h2>Rata kredytu (zaokrąglona): {roundedInstallment} zł</h2>

      <div className="installments">
        <table>
          <tr>
            {headers.map((header) => (
              <th
                className="installments__header"
                style={{ border: "1px solid black" }}
              >
                {header}
              </th>
            ))}
          </tr>
          {installments.map((month) => (
            <tr>
              {data[month].map((value) => (
                <td className="installments__data">{value}</td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default App;
