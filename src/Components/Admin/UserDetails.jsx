import { useEffect, useState } from "react";
import {fetchAllData,} from "../../FirestoreDB/AdminQuery";


function UserDetails() {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const getData = async () => {
        const fetchedData = await fetchAllData();
        setData(fetchedData);
      };
  
      getData();
    }, []);

    
  return (
    <div className="p-0">
              <div className="container text-center">
        <div className="row">
          <div className="col">
          <h2 className="text-center btn btn-primary bg-white"><a href="http://">Add</a></h2>
            
          </div>
          <div className="col">
            <h2 className="text-center">User Details</h2>
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
            <th>Email</th>
            <th>Add / Remove</th>
          </tr>
        </thead>
        <tbody className="text-start">
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                <a className="m-3" href="">
                  Add
                </a>
                <a href="">Remove</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserDetails;
