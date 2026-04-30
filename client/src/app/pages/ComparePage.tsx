export default function ComparePage() {
    return (
      <div style={{ padding: "80px 20px 20px 20px" }}>
        <h2>Compare Cities</h2>
  
        <h3>Los Angeles vs Fullerton</h3>
  
        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Los Angeles</th>
              <th>Fullerton</th>
            </tr>
          </thead>
  
          <tbody>
            <tr>
              <td>Risk Score</td>
              <td>High</td>
              <td>Medium</td>
            </tr>
            <tr>
              <td>Fire Risk</td>
              <td>High</td>
              <td>Low</td>
            </tr>
            <tr>
              <td>Flood Risk</td>
              <td>Low</td>
              <td>High</td>
            </tr>
            <tr>
              <td>Air Quality</td>
              <td>Moderate</td>
              <td>Moderate</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }