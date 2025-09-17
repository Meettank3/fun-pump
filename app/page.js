"use client"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import config from "./config.json";

// Components
import Header from "./components/Header";
import Token from "./components/Token";
import images from "./images.json";

// ABIs & Config
import Factory from "./abis/Factory.json";
import List from "./components/List";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [factory, setFactory] = useState(null);
  const [fee, setFee] = useState(0);
  const [token, setToken] = useState([]);
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

    const totalTokens = await factory.totalTokens();
    const tokens = [];

    for(let i = 0; i < totalTokens; i++){
      if(i ==6 ){
        break;
      }

      const tokenSale = await factory.getTokenSale(i);

      const token = {
        token: tokenSale.token,
        name: tokenSale.name,
        creator: tokenSale.creator,
        sold: tokenSale.sold,
        raised: tokenSale.raised,
        isOpen: tokenSale.isOpen,
        image: images[i],
      }

      tokens.push(token);
    }

    setToken(tokens.reverse());
    console.log(tokens);

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

          <div className="listings">

              <h1> New Listings </h1>

              <div className="tokens">
                {!account ? (
                  <p>Please Connect Wallet</p>
                ) : token.length === 0 ? (
                  <p>No Tokens Listed</p>
                ) : (
                  token.map((token, index) => (
                    <Token 
                    toggleTrade={()=>{}}
                    token={token}
                    key={index}
                    />
                  ))
                )}
              </div>
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
