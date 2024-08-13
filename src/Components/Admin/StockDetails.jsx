import { useEffect, useState } from "react";
import { fetchStockData } from "../../FirestoreDB/AdminQuery";

function StockDetails() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const fetchedStockData = await fetchStockData();
      setStockData(fetchedStockData);
    };

    getData();
  }, []);
  return (
    <div>
      <div className="container text-center">
        <div className="row">
          <div className="col">
          <h2 className="text-center btn btn-primary bg-white"><a href="http://">Add</a></h2>
            
          </div>
          <div className="col">
            <h2 className="text-center">Stock Details</h2>
          </div>
          <div className="col">
          <h2 className="text-center btn btn-primary bg-white"><a href="http://">Remove</a></h2>

          </div>
        </div>
      </div>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Stock Left</th>
          </tr>
        </thead>
        <tbody className="text-start">
          {stockData.map((item) => (
            <tr key={item.id}>
              <td>{item.ID}</td>
              <td>{item.Name}</td>
              <td>{item.Category}</td>
              <td>{item.Price}</td>
              <td>{item.Description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockDetails;
