"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import config from "./config.json";

// Components
import Header from "./components/Header";

// ABIs & Config
import Factory from "./abis/Factory.json";
import List from "./components/List";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [factory, setFactory] = useState(null);
  const [fee, setFee] = useState(0);
  const [showCreate, setShowCreate] = useState(null);

  function toggleCreate() {
    showCreate ? setShowCreate(false) : setShowCreate(true);
  }

  async function loadBlockchainData() {
    //if (typeof window === "undefined") return; // ✅ prevent SSR mismatch
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();    

    const factory = new ethers.Contract(config[network.chainId].factory.address, Factory, provider);
    setFactory(factory);

    const fee = await factory.fee();
    setFee(fee);
  }

  useEffect( () => {
    loadBlockchainData();
  }, []);

  return (
    <div className="page">
      
      <Header account = {account} setAccount = {setAccount} />

      <main>
        <div className="create">
          <button onClick={ factory && account && toggleCreate} className="btn--fancy">
          { !factory ? (
              "[Contract not deployed]"
            ) : !account ? (
              "[Please connect]"
            ) : (
              "[Start a New Token]"
          )}
          </button>
        </div>
      </main>
    {
      showCreate && 
      ( 
        <List toggleCreate={toggleCreate}  fee={fee} provider={provider} factory={factory} /> 
      )
    }
      

    </div>
  );
}
