import { ethers } from "ethers";
import { useState } from "react";

declare global {
    interface Window {
        coinbaseWalletExtension?: any;
        ethereum?: any;
    }
}

interface AccountInfo {
    address: string;
    balance: string;
}

export default function MetaMaskWallet() {
    const [accounts, setAccounts] = useState<AccountInfo[]>([]);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            setError(null);

            if (!window.ethereum) {
                alert("Please install MetaMask!");
                return;
            }

            // Request accounts from the user
            const metamaskProvider = window.ethereum.providers.find((provider: any) => provider.isMetaMask);
            const requestedAccounts = await metamaskProvider.request({
                method: "eth_requestAccounts",
            });

            const provider = new ethers.BrowserProvider(metamaskProvider);

            // Get the balance for each account
            const accountBalances = await Promise.all(
                requestedAccounts.map(async (address: string) => {
                    const balanceWei = await provider.getBalance(address);
                    const balanceEth = ethers.formatEther(balanceWei); // convert from wei to ether

                    return { address, balance: balanceEth };
                })
            );

            setAccounts(accountBalances);
        } catch (err: any) {
            console.error("Error connecting wallet:", err);
            setError(err.message || "An error occurred while connecting the wallet.");
        }
    };

    return (
        <div className="mt-10 w-full px-4 md:px-10">
            {accounts.length === 0 && (
                <button onClick={connectWallet} className="btn btn-primary">
                    Connect MetaMask
                </button>
            )}

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* --- Table for displaying accounts and balances --- */}
            {accounts.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-center">MetaMask Accounts</h2>
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="table table-zebra w-full">
                            {/* Table Head */}
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-4">#</th>
                                    <th className="p-4">Address</th>
                                    <th className="p-4 text-right">Balance (USD)</th>
                                </tr>
                            </thead>
                            {/* Table Body */}
                            <tbody>
                                {accounts.map((account, index) => (
                                    <tr key={account.address} className="hover">
                                        <th className="p-4">{index + 1}</th>
                                        <td className="p-4 font-mono text-sm">{account.address}</td>
                                        <td className="p-4 font-mono text-sm text-right">{parseFloat(account.balance).toFixed(4)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
