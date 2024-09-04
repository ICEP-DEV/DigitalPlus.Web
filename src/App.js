import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './screens/Login';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Routes>
      <Route exact path='/' element={<Login />} />
      </Routes>
    </Router>
  );
}
export default App;
