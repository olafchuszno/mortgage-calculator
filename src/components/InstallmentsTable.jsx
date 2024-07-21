export const InstallmentsTable = ({ headers, installments, data }) => {
  return (
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
  );
};
