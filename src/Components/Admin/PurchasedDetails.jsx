import { useEffect, useState } from "react";
import { fetchPurchasedData } from "../../FirestoreDB/AdminQuery";
// import { Link } from "react-router-dom";


function PurchasedDetails() {
  const [purchasedData, setPurchasedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedPurchasedData = await fetchPurchasedData();
        setPurchasedData(fetchedPurchasedData);
      } catch (err) {
        setError("Failed to fetch purchased data");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-center">Purchased Details</h2>
      {purchasedData.length > 0 ? (
        purchasedData.map((purchase, index) => (
          <div key={index} className="mb-4">
            <h4>User: {purchase.email}</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{purchase.name}</td>
                  <td>{purchase.quantity}</td>
                  <td>${purchase.price}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-right font-weight-bold">
                    Total:
                  </td>
                  <td className="font-weight-bold">${purchase.totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No purchased items found.</p>
      )}
    </div>
  );
}

export default PurchasedDetails;