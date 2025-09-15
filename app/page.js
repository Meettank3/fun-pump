"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";

// Components
import Header from "./components/Header";

// ABIs & Config

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);


  async function loadBlockchainData() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    console.log(provider);
  }

  useEffect( () => {
    loadBlockchainData();
  }, []) ;

  return (
    <div className="page">
      
      <Header account = {account} setAccount = {setAccount} />

    </div>
  );
}
