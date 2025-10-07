import { ethers } from "ethers";
import { useEffect } from "react";

function Header({ account, setAccount }) {

  async function connectHandler() {    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
    localStorage.setItem("isWalletConnected", "true");
  }

  useEffect(() => {
    async function checkConnection() {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const account = ethers.getAddress(accounts[0]);
          setAccount(account);
        }
      }
    }

    if (localStorage.getItem("isWalletConnected") === "true") {
      checkConnection();
    }

    // 🔹 Listen for account changes
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        // User disconnected all accounts
        localStorage.removeItem("isWalletConnected");
        setAccount(null);
      } else {
        // User switched accounts
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
        localStorage.setItem("isWalletConnected", "true");
      }
    });

    // Cleanup listener on unmount
    return () => {
      window.ethereum?.removeAllListeners("accountsChanged");
    };
  }, []);

  return (
    <header>
      <p className="brand">fun.pump</p>

      {account ? (
        <button className="btn--fancy">
          [ {account.slice(0, 6) + "..." + account.slice(38, 42)} ]
        </button>
      ) : (
        <button onClick={connectHandler} className="btn--fancy">
          Connect Wallet
        </button>
      )}
    </header>
  );
}

export default Header;
