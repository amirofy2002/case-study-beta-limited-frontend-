"use client";

import { useState } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [file, setFile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (event: any) => {
      setFile(event.target.files[0]);
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log({ url: process.env.BASE_URL });
      const url = `${process.env.BASE_URL}/beta-api/upload`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setTransactions(data.transactions);
        })
        .catch((error) => console.error(error));
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">
          Transaction Analyzer
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          onClick={handleUpload}
        >
          Upload CSV
        </button>
      </header>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Spend</p>
          <p className="text-2xl font-bold">$955.83</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Transactions</p>
          <p className="text-2xl font-bold">26</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Avg. Transaction</p>
          <p className="text-2xl font-bold">$36.76</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Merchants</p>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>

      {/* Detected Patterns Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Detected Patterns
        </h2>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-200 pb-4"
            >
              <div>
                <h3 className="text-gray-800 font-semibold">
                  {transaction.description}
                </h3>
                <p className="text-gray-500 text-sm">{transaction.type}</p>
                <p className="text-gray-400 text-sm">{transaction.details}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-800 font-bold">{transaction.amount}</p>
                {transaction.date && (
                  <p className="text-gray-400 text-sm">{transaction.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
