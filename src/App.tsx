import "./App.css";
import React from "react";
import { useMemo, useState } from "react";
import { InstallmentsTable } from "./components/InstallmentsTable.jsx";
import { calculateFixedInstallmentData } from "./helpers/calculateFixedInstallmentData";
import { calculateDecreasingInstallmentData } from "./helpers/calculateDecreasingInstallmentData";

type InstallmentType = "fixed" | "decreasing";

function App() {
  const [interest, setInterest] = useState(0.1);
  const [totalInstallments, setTotalInstallments] = useState(120);
  const [totalAmount, setTotalAmount] = useState(500000);
  const [installmentType, setInstallmentType] =
    useState<InstallmentType>("fixed");

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

  const roundedCapitalInEachInstallment = useMemo(() => {
    return Math.ceil((totalAmount / totalInstallments) * 100) / 100;
  }, []);

  const headers = [
    "Numer raty",
    "Początkowa wartość",
    "Rata",
    "Odsetki",
    "Kapitał",
    "Wartość końcowa",
  ];

  const installments: number[] = [];

  for (let i: number = 1; i <= totalInstallments; i++) {
    installments.push(i);
  }

  const data =
    installmentType === "fixed"
      ? calculateFixedInstallmentData(
          totalAmount,
          totalInstallments,
          roundedInstallment,
          monthlyInterest
        )
      : calculateDecreasingInstallmentData(
          totalAmount,
          totalInstallments,
          roundedCapitalInEachInstallment,
          monthlyInterest
        );

  return (
    <div className="App">
      <header style={{ marginBottom: "-160px" }} className="App-header">
        <h1>Kalkulator hipoteczny</h1>
      </header>

      <div className="inputs">
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="totalAmount">Rata stała/malejąca</label>
          <select
            id="totalAmount"
            onChange={(event) => {
              event.preventDefault();
              setInstallmentType(event.target.value as InstallmentType);
            }}
            value={totalAmount}
            name="interest"
          >
            <option value="fixed">Stała</option>
            <option value="decreasing">Malejąca</option>
          </select>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="totalAmount">Kwota kredytu (zł)</label>
          <input
            id="totalAmount"
            onChange={(event) => {
              event.preventDefault();
              setTotalAmount(+event.target.value);
            }}
            value={totalAmount}
            name="interest"
            type="number"
          />
          <p>Kwota kredytu (w zł): {totalAmount}</p>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label htmlFor="interest">Oprocentowanie nominalne (w %)</label>
          <input
            id="interest"
            onChange={(event) => {
              event.preventDefault();
              setInterest(+event.target.value / 100);
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
          <label htmlFor="totalInstallments">Ilość rat (łącznie)</label>
          <input
            id="totalInstallments"
            onChange={(event) => {
              event.preventDefault();
              setTotalInstallments(+event.target.value);
            }}
            value={totalInstallments}
            name="totalInstallments"
            type="number"
          />
          <p>Łączna ilość rat (w kredycie): {totalInstallments}</p>
        </div>
      </div>

      {installmentType === "fixed" && (
        <h2>Rata kredytu (zaokrąglona): {roundedInstallment} zł</h2>
      )}

      {installmentType === "decreasing" && (
        <h2>Część kapiatłu w racie: {roundedInstallment} zł</h2>
      )}

      <div className="installments">
        <InstallmentsTable
          headers={headers}
          installments={installments}
          data={data}
        />
      </div>
    </div>
  );
}

export default App;
