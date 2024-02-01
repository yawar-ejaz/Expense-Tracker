import axios from "axios";
import React from "react";
import { FaTrash } from "react-icons/fa";

const ExpenseTable = ({ expenses, getExpenses }) => {
  const dateOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  const deleteExpense = async (expenseId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("user"));
      const result = await axios.delete(`/expense/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getExpenses();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="container mx-auto text-center">
        <h1 className="text-2xl font-bold">You currently have no expenses</h1>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-zebra table-xs md:table-md my-4 ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">AMOUNT</th>
              <th scope="col">CATEGORY</th>
              <th scope="col">DESCRIPTION</th>
              <th scope="col">DATE</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>
                  {new Date(expense.updatedAt).toLocaleDateString(
                    "en-US",
                    dateOptions
                  )}
                </td>
                <td>
                  <button
                    className="cursor-pointer"
                    onClick={() => deleteExpense(expense._id)}
                  >
                    <FaTrash className="h-4 w-4 text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpenseTable;
