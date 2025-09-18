import { ethers } from "ethers";
import { useEffect, useState } from 'react';


function Trade({ toggleTrade, token, provider, factory }) {
  const [target, setTarget] = useState(0);
  const [limit, setLimit] = useState(0);
  const [cost, setCost] = useState(0);
  
  async function getSaleDetails(){
    const target = await factory.TARGET();
    setTarget(target);
    
    const limit = await factory.TOKEN_LIMIT();
    setLimit(limit);

    const cost = await factory.getCost(token.sold);
    setCost(cost);
  }

  useEffect(()=> {
    getSaleDetails();
  }, [])

  return (
    <div className="trade">
      <h2>Trade</h2>

      <div className="token__details" >
      
      <p className="name">{token.name}</p>
      <p>Creator: {token.creator.slice(0,6) + '...' + token.creator.slice(38,42)}</p>
      <img src={token.image} alt="token image" width={256} height={256} />
      <p>Market Cap {ethers.formatUnits(token.raised, 18)} ETH</p>
      </div>

      <p>base cost: {ethers.formatUnits(cost,18)} ETH</p>
      <button onClick={toggleTrade} className="btn--fancy">[Cancle]</button>
      

    </div >
  );
}

export default Trade;