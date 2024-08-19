import { useEffect, useState } from "react";
import { fetchPurchasedData } from "../../FirestoreDB/AdminQuery";

function PurchasedDetails() {
  const [purchasedData, setPurchasedData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedPurchasedData = await fetchPurchasedData();
        if (Array.isArray(fetchedPurchasedData)) {
          const groupedData = fetchedPurchasedData.reduce((acc, purchase) => {
            const { email } = purchase;
            if (!acc[email]) {
              acc[email] = [];
            }
            acc[email].push(purchase);
            return acc;
          }, {});

          setPurchasedData(groupedData);
        } else {
          setError("Unexpected data structure received");
        }
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
      
      {Object.keys(purchasedData).length > 0 ? (
        Object.keys(purchasedData).map((email, index) => (
          <div key={index} className="mb-4">
            <h4>User: {email}</h4>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {purchasedData[email].map((purchase, i) => (
                  <tr key={i}>
                    <td>{purchase.name}</td>
                    <td>{purchase.quantity}</td>
                    <td>${purchase.price}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-right font-weight-bold">
                    Total:
                  </td>
                  <td className="font-weight-bold">${purchasedData[email].reduce((total, purchase) => total + purchase.totalPrice, 0)}</td>
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
