import React, { useState } from "react";
import axios from "axios";

const UpdateSalary = ({ onSalaryUpdated }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token"); // Get JWT token
      if (!token) {
        setMessage("You must be logged in.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/salary/update", // Your backend endpoint
        {
          employeeId,
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token
          },
        }
      );

      setMessage(res.data.message || "Salary updated successfully.");
      setEmployeeId("");
      setAmount("");

      // Refresh history if callback provided
      if (onSalaryUpdated) {
        onSalaryUpdated();
      }
    } catch (err) {
      console.error("Error updating salary:", err);
      setMessage(
        err.response?.data?.error || "Failed to update salary. Try again."
      );
    }
  };

  return (
    <div>
      <h2>Update Salary</h2>
      <form onSubmit={handleUpdateSalary}>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Salary Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateSalary;
