import { ethers } from "ethers";

function List({ toggleCreate, fee, provider, factory }) {

  return (
    <div className = "list">

      <h2> list new </h2>

      <div className="list__description">
        <p> Fee: {ethers.formatUnits(fee, 18) } ETH </p>
      </div>

      <form >
        <input type="text" name="name" placeholder="name" />
        <input type="text" name="ticker" placeholder="ticker" />
        <input type="submit" value= "[ list ]" />
      </form>

      <button onClick={toggleCreate} className="btn--fancy" > [cancel] </button>
    </div>
  );
}

export default List;