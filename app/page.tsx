"use client";

import { useState } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [total, setTotal] = useState<number>(0);
  const [merchantCount, setMerchanCounts] = useState<number>(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [merchants, setMerchants] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [patterns, setPatterns] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"merchantAnalysis" | "patterns">(
    "merchantAnalysis"
  );

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log({ url: process.env.BASE_URL });
      const url = `${process.env.BASE_URL}/api/upload`;
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setMerchants(data.normalized_transactions);
          setPatterns(data.detected_patterns);
          setTransactions(data.transactions);
          setTotal(
            data.transactions.reduce(
              (prev: number, cur: { amount: number }) => prev + cur.amount,
              0
            )
          );

          const merchants = data.normalized_transactions
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((p: any) => p.normalized.merchant)
            .reduce((prev: Record<string, number>, cur: string) => {
              prev[cur] = 1;
              return prev;
            }, {});
          console.log({ merchants });
          setMerchanCounts(Object.keys(merchants).length);
        })
        .catch((error) => console.error(error));
    };
    input.click();
  };

  const handleTabSwitch = (tab: "merchantAnalysis" | "patterns") => {
    setActiveTab(tab);
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
          <p className="text-2xl font-bold  text-gray-800">
            ${total.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Transactions</p>
          <p className="text-2xl font-bold text-gray-800">
            {transactions?.length ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Avg. Transaction</p>
          <p className="text-2xl font-bold  text-gray-800">
            ${(total / transactions.length).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Merchants</p>
          <p className="text-2xl font-bold  text-gray-800">{merchantCount}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mt-6">
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            activeTab === "merchantAnalysis"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabSwitch("merchantAnalysis")}
        >
          Merchant Analysis
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            activeTab === "patterns"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabSwitch("patterns")}
        >
          Pattern Detection
        </button>
      </div>

      {/* Detected Patterns Section */}
      {activeTab == "patterns" ? (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Detected Patterns
          </h2>
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-gray-400 p-4 rounded"
              >
                <div>
                  <h3 className="text-gray-800 font-semibold">
                    {pattern.merchant}
                  </h3>
                  <span className="text-gray-500 text-sm">{pattern.type}</span>
                  <span className="text-gray-400 text-sm p-2">
                    {pattern.frequency}
                  </span>
                  <p className="text-gray-500 text-xs"> {pattern.notes} </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-800 font-bold">{pattern.amount}</p>
                  {pattern.next_expected && (
                    <p className="text-gray-400 text-sm">
                      Next: {pattern.next_expected}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Normalized Merchants
          </h2>
          <div className="space-y-4">
            {merchants.map((merchant, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50 flex flex-row"
              >
                <div className="flex flex-col">
                  <p className="text-gray-500">
                    <span className="font-bold text-xs">Original:</span> <br />
                    <span className="text-gray-800 font-bold ">
                      {merchant.original}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                      {merchant?.normalized?.category}
                    </span>
                    <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                      {merchant?.normalized?.sub_category}
                    </span>
                    {merchant.normalized.flags.map(
                      (flag: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                        >
                          {flag}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <span className="grow"></span>
                <p className="text-gray-400 font-bold mt-2 text-right">
                  <span className="text-xs">Normalized:</span>
                  <br />
                  <span className="text-gray-800">
                    {merchant.normalized.merchant}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
