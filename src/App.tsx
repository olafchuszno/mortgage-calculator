import "./App.css";
import React, { useEffect } from "react";
import { useMemo, useState } from "react";
import { InstallmentsTable } from "./components/InstallmentsTable.jsx";
import { calculateFixedInstallmentData } from "./helpers/calculateFixedInstallmentData";
import { calculateDecreasingInstallmentData } from "./helpers/calculateDecreasingInstallmentData";
import { numberWithCommas } from "./helpers/numberWithCommas.js";

type InstallmentType = "fixed" | "decreasing";

function App() {
  const [interest, setInterest] = useState(0.1);
  const [totalInstallments, setTotalInstallments] = useState(120);
  const [totalAmount, setTotalAmount] = useState(500000);
  const [installmentType, setInstallmentType] =
    useState<InstallmentType>("fixed");

  const [displayedTotalAmount, setDisplayedTotalAmount] = useState(500000);
  const [displayedInterest, setDisplayedInterest] = useState(500000);
  const [displayAdditionalInfo, setDisplayAdditionalInfo] = useState(false);

  // Additional info
  const [capitalPaidAfterMonths, setCapitalPaidAfterMonths] =
    useState<number>(0);
  const [displayedCapitalPaidAfterMonths, setDisplayedCapitalPaidAfterMonths] =
    useState<number>(0);

  useEffect(() => {
    // ["1", "5", "5"]
    const stringAmount = totalAmount.toString().split("");

    // && stringAmount[1] !== ","
    if (
      stringAmount.length > 1 &&
      stringAmount[1] !== "," &&
      stringAmount[1] !== "."
    ) {
      if (stringAmount[0] === "0") {
        stringAmount.splice(0, 1);
      }
    }

    setDisplayedTotalAmount(+stringAmount.join(""));
  }, [totalAmount]);

  useEffect(() => {
    // ["1", "5", "5"]
    const stringMonths = capitalPaidAfterMonths.toString().split("");

    // && stringAmount[1] !== ","
    if (stringMonths.length > 1) {
      if (stringMonths[0] === "0") {
        stringMonths.splice(0, 1);
      }
    }

    setDisplayedCapitalPaidAfterMonths(+stringMonths.join(""));
  }, [capitalPaidAfterMonths]);

  useEffect(() => {
    // ["1", "5", "5"]
    const stringInterest = interest.toString().split("");

    // && stringAmount[1] !== ","
    if (
      stringInterest.length > 1 &&
      stringInterest[1] !== "," &&
      stringInterest[1] !== "."
    ) {
      if (stringInterest[0] === "0") {
        stringInterest.splice(0, 1);
      }
    }

    setDisplayedInterest(+stringInterest.join(""));
  }, [interest]);

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

  const roundedCapitalInEachInstallment =
    Math.ceil((totalAmount / totalInstallments) * 100) / 100;

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

  const capitalPaid = useMemo(() => {
    return data
      .slice(0, capitalPaidAfterMonths + 1)
      .reduce((accu, currentMonth) => currentMonth[4] + accu, 0);
  }, [data, capitalPaidAfterMonths]);

  const totalInterest = useMemo(
    () =>
      Math.round(
        data.reduce(
          (accu, currentInstallment) => accu + currentInstallment[3],
          0
        ) * 100
      ) / 100,
    [data]
  );

  return (
    <div className="App">
      <header style={{ marginBottom: "-160px" }} className="App-header">
        <h1>Kalkulator hipoteczny</h1>
      </header>

      <div id="top" className="inputs">
        <div style={{ marginBottom: "50px" }}>
          <label className="input-label" htmlFor="totalAmount">
            Rata stała/malejąca
          </label>
          <select
            id="totalAmount"
            onChange={(event) => {
              event.preventDefault();
              setInstallmentType(event.target.value as InstallmentType);
            }}
            value={installmentType}
            name="interest"
          >
            <option value="fixed">Stała</option>
            <option value="decreasing">Malejąca</option>
          </select>
        </div>

        <div style={{ marginBottom: "50px" }}>
          <label className="input-label" htmlFor="totalAmount">
            Kwota kredytu (zł)
          </label>

          <input
            id="totalAmount"
            onChange={(event) => {
              event.preventDefault();
              setTotalAmount(+event.target.value);
            }}
            value={displayedTotalAmount}
            name="interest"
            type="number"
          />
          <p>Kwota kredytu: {numberWithCommas(totalAmount)} zł</p>
        </div>

        <div style={{ marginBottom: "50px" }}>
          <label className="input-label" htmlFor="interest">
            Oprocentowanie nominalne (w %)
          </label>
          <input
            id="interest"
            onChange={(event) => {
              event.preventDefault();
              setInterest(+event.target.value / 100);
            }}
            value={displayedInterest * 100}
            name="interest"
            type="number"
          />
          <p>
            Oprocentowanie nominalne (roczne, dziesiętnie): {displayedInterest}
          </p>
          <p>
            Oprocentowanie miesięczne (zaokrąglone w %):{" "}
            {Math.round(monthlyInterest * 10000) / 100}
          </p>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <label className="input-label" htmlFor="totalInstallments">
            Ilość rat (łącznie)
          </label>
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

      <div className="display-additional-info">
        <button onClick={() => setDisplayAdditionalInfo((current) => !current)}>
          Pokaż Zaawansowane
        </button>
      </div>

      {displayAdditionalInfo && (
        <div className="additional-info">
          <div className="capital-paid">
            <label className="input-label" htmlFor="totalInstallments">
              Kapitał spłacony po x ratach
            </label>

            <input
              id="capitalPaid"
              onChange={(event) => {
                event.preventDefault();
                setCapitalPaidAfterMonths(+event.target.value);
              }}
              value={displayedCapitalPaidAfterMonths}
              name="totalInstallments"
              type="number"
            />

            <p>
              Kapitał spłacony po {displayedCapitalPaidAfterMonths}{" "}
              {capitalPaidAfterMonths === 1 ? "racie" : "ratach"}:{" "}
              {Math.round(capitalPaid * 100) / 100} zł
            </p>
          </div>
        </div>
      )}

      <div className="main-info">
        {installmentType === "fixed" && (
          <h2>Rata kredytu: {roundedInstallment} zł</h2>
        )}
        {installmentType === "decreasing" && (
          <h2>
            Część kapiatłu w racie:{" "}
            {numberWithCommas(roundedCapitalInEachInstallment)} zł
          </h2>
        )}

        <h2>
          Łączna suma zapłaconych odsetek: {numberWithCommas(totalInterest)} zł
        </h2>

        <a className="bottom-link" href="#bottom">
          Przejdź na sam dół
        </a>
      </div>

      <div className="installments">
        <InstallmentsTable
          headers={headers}
          installments={installments}
          data={data}
        />
      </div>

      <a id="bottom" className="bottom-link" href="#top">
        Do góry
      </a>
    </div>
  );
}

export default App;
