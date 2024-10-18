"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useState, useEffect } from "react";

// Define the input type for the verification command
export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

// Predefined payload for verification
const verifyPayload: VerifyCommandInput = {
  action: "verify", // Your action ID from the Developer Portal
  signal: "0x12312", // Optional additional data
  verification_level: VerificationLevel.Orb, // Orb | Device
};

// Trigger the verification process
const triggerVerify = () => {
  MiniKit.commands.verify(verifyPayload);
  console.log("Verified");
};

// List of countries for the dropdown
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
  // State hooks for Age, Country, and Verification Status
  const [age, setAge] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>("welcome");
  const [totalRewards, setTotalRewards] = useState<number>(1000); // Example value
  const [claimHistory, setClaimHistory] = useState([
    { date: "2024-01-15", amount: 500 },
    { date: "2024-02-01", amount: 300 },
  ]);

  useEffect(() => {
    // Verification logic (commented out as in the original code)
    // ...
  }, [age, country]);

  const handleClaim = () => {
    // Logic to process the claim
    console.log("Claim processed");
    // Update claim history
    setClaimHistory([
      { date: new Date().toISOString().split("T")[0], amount: totalRewards },
      ...claimHistory,
    ]);
    // Reset total rewards
    setTotalRewards(0);
  };

  const renderWelcomePage = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Welcome to zkID Pool</h2>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full mb-4"
        onClick={() => setCurrentPage("contribute")}
      >
        Contribute to pool and earn $POOLS
      </button>
      <button
        className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full"
        onClick={() => setCurrentPage("claim")}
      >
        Claim Rewards
      </button>
    </div>
  );

  const renderContributePage = () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Contribute to Pool</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Age</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Country</label>
        <select
          className="border p-2 w-full"
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
      <button
        className="bg-green-500 p-4 w-full text-white font-bold"
        onClick={triggerVerify}
      >
        Verify and Contribute
      </button>
    </div>
  );

  const renderClaimRewardsPage = () => (
    <div>
      <h2 className="text-lg font-bold mb-4">Claim Rewards</h2>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p className="font-semibold">Total Amount to Claim:</p>
        <p className="text-2xl font-bold">${totalRewards}</p>
      </div>
      <button
        className="bg-green-500 p-4 w-full text-white font-bold mb-4"
        onClick={handleClaim}
      >
        Claim Rewards
      </button>
      <h3 className="font-semibold mb-2">Claim History</h3>
      <ul className="space-y-2">
        {claimHistory.map((claim, index) => (
          <li
            key={index}
            className="bg-gray-50 p-2 rounded flex justify-between"
          >
            <span>{claim.date}</span>
            <span className="font-semibold">${claim.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSuccessMessage = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Minted 100 zkIDs!</h2>
      <p>Congratulations, you have successfully minted your zkIDs.</p>
    </div>
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
    <div className="p-4">
      {renderContent()}
      {currentPage !== "welcome" && (
        <button
          className="mt-4 text-blue-500 underline"
          onClick={() => setCurrentPage("welcome")}
        >
          Back to Welcome Page
        </button>
      )}
    </div>
  );
};
