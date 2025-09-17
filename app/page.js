"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import config from "./config.json";

// Components
import Header from "./components/Header";

// ABIs & Config

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);


  async function loadBlockchainData() {
    //if (typeof window === "undefined") return; // ✅ prevent SSR mismatch
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();    
    console.log(config[network.chainId].factory.address);    
  }

  useEffect( () => {
    loadBlockchainData();
  }, []);

  return (
    <div className="page">
      
      <Header account = {account} setAccount = {setAccount} />

    </div>
  );
}
