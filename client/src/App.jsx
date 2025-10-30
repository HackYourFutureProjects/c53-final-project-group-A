import Layout from "./components/Layout";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* <Route path='/jobs' element={<JobListingPage/>}> */}
      </Route>
    </Routes>
  );
}

export default App;
