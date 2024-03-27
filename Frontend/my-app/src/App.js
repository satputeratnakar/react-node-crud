import './App.css';
import BeneficiaryTable from './Component/BeneficiaryTable';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AddBeneficiary from './Component/AddBeneficiary';


function App() {
  const Routing = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BeneficiaryTable />} />
          <Route path="/create-update-beneficiary" element={<AddBeneficiary />} />
        </Routes>
      </BrowserRouter>
    )
  }
  return (
    <div className="App">
      <Routing />
    </div>
  );
}

export default App;
