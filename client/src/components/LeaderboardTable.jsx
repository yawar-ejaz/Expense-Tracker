import React from "react";
import { FaCrown } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

const LeaderboardTable = ({ accounts }) => {

  if (accounts.length === 0) {
    return <h1>There are no leaders currently.</h1>;
  }
  return (
    <>
      <table className="table table-zebra table-md my-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">NAME</th>
            <th scope="col">TYPE</th>
            <th scope="col">TOTAL EXPENSE</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{account.name}</td>
              <td>
                {account.isPremium ? (
                  <FaCrown className="h-4 w-4 text-yellow-300" />
                ) : (
                  <IoPerson className="h-4 w-4 text-green-600"/>
                )}
              </td>
              <td>{account.totalExpense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LeaderboardTable;
