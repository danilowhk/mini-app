"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyPayload: VerifyCommandInput = {
  action: "verify",
  signal: "0x12312",
  verification_level: VerificationLevel.Orb,
};

const triggerVerify = () => {
  MiniKit.commands.verify(verifyPayload);
  console.log("Verified");
};

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "South Africa",
  "Russia",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "South Korea",
  "New Zealand",
  "Switzerland",
];

export const VerifyBlock = () => {
  const [age, setAge] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>("welcome");
  const [totalRewards, setTotalRewards] = useState<number>(1000);
  const [claimHistory, setClaimHistory] = useState([
    { date: "2024-01-15", amount: 500 },
    { date: "2024-02-01", amount: 300 },
  ]);

  useEffect(() => {
    // Verification logic (commented out as in the original code)
    // ...
  }, [age, country]);

  const handleClaim = () => {
    console.log("Claim processed");
    setClaimHistory([
      { date: new Date().toISOString().split("T")[0], amount: totalRewards },
      ...claimHistory,
    ]);
    setTotalRewards(0);
  };

  const renderWelcomePage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center w-full"
    >
      <h2 className="text-4xl font-bold mb-12 text-blue-600">
        Welcome to zkID Pool
      </h2>
      <div className="space-y-6 max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg w-full transition duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={() => setCurrentPage("contribute")}
        >
          Contribute to pool and earn $POOLS
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg w-full transition duration-300 ease-in-out transform hover:-translate-y-1"
          onClick={() => setCurrentPage("claim")}
        >
          Claim Rewards
        </motion.button>
      </div>
    </motion.div>
  );

  const renderContributePage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-8 text-blue-600">
        Contribute to Pool
      </h2>
      <div className="mb-6">
        <label
          className="block text-lg font-medium text-gray-700 mb-2"
          htmlFor="age"
        >
          Age
        </label>
        <input
          id="age"
          type="number"
          className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>
      <div className="mb-8">
        <label
          className="block text-lg font-medium text-gray-700 mb-2"
          htmlFor="country"
        >
          Country
        </label>
        <select
          id="country"
          className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select your country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg w-full transition duration-300 ease-in-out transform hover:-translate-y-1 text-lg"
        onClick={triggerVerify}
      >
        Verify and Contribute
      </motion.button>
    </motion.div>
  );

  const renderClaimRewardsPage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-8 text-green-600">Claim Rewards</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <p className="text-lg font-medium text-gray-500">
          Total Amount to Claim
        </p>
        <p className="text-5xl font-bold text-green-600">
          ${totalRewards.toLocaleString()}
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg w-full mb-8 transition duration-300 ease-in-out transform hover:-translate-y-1 text-lg"
        onClick={handleClaim}
      >
        Claim Rewards
      </motion.button>
      <h3 className="font-semibold text-xl mb-6 text-gray-700">
        Claim History
      </h3>
      <ul className="space-y-4">
        {claimHistory.map((claim, index) => (
          <li
            key={index}
            className="bg-gray-50 p-6 rounded-lg shadow flex justify-between items-center"
          >
            <span className="text-gray-600 text-lg">{claim.date}</span>
            <span className="font-semibold text-green-600 text-xl">
              ${claim.amount.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  const renderSuccessMessage = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center bg-green-100 p-12 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
    >
      <h2 className="text-4xl font-bold mb-6 text-green-600">
        Minted 100 zkIDs!
      </h2>
      <p className="text-xl text-gray-700">
        Congratulations, you have successfully minted your zkIDs.
      </p>
    </motion.div>
  );

  const renderContent = () => {
    if (isVerified) {
      return renderSuccessMessage();
    }

    switch (currentPage) {
      case "welcome":
        return renderWelcomePage();
      case "contribute":
        return renderContributePage();
      case "claim":
        return renderClaimRewardsPage();
      default:
        return renderWelcomePage();
    }
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8 sm:p-12">
          {renderContent()}
          {currentPage !== "welcome" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 text-blue-500 hover:text-blue-600 font-medium text-lg"
              onClick={() => setCurrentPage("welcome")}
            >
              ← Back to Welcome Page
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
