import React from 'react';
import { useNavigate } from 'react-router-dom';

const Table = (props) => {


  const { headers, rows, tableName, clientId } = props;
  return (
    <div>
      <table className="table table-bordered table-hover">
        <TableHeader headers={headers}></TableHeader>
        <TableBody headers={headers} rows={rows} tableName={tableName} clientId={clientId}></TableBody>
      </table>
    </div>
  );
}

const TableHeader = (props) => {
  const { headers } = props;
  return (
    <thead className="thead-dark" key="header-1">
      <tr key="header-0">
        {headers && headers.map((value, index) => {
          return <th key={index}><div>{value}</div></th>
        })}
      </tr>
    </thead>
  );
}

const TableBody = (props) => {
  const { headers, rows, tableName, clientId } = props;
  const navigate = useNavigate();

  function buildRow(row, headers) {
    return (
      <tr style={{ cursor: "pointer" }} key={row.codPatient} onClick={() => {
        if (tableName === "client") {
          navigate("/clients/" + row.codPatient)
        } else {
          navigate("/client/" + clientId + "/registration/" + row.idRegistration)
        }
      }
      }>
        {
          headers.map((value, index) => {
            return <td key={index}>{row[value]}</td>
          })
        }
      </tr >
    )
  };

  return (
    <tbody>
      {rows && rows.map((value) => {
        return buildRow(value, headers);
      })}
    </tbody>
  );
}

export default Table;