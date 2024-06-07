import React, { useState } from 'react';
import Login from './Components/Login';
import Form from './Components/Form';
import Result from './Components/Result';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [result, setResult] = useState(null);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="App bg-gradient-to-b from-green-300 to-white min-h-screen flex justify-center items-center">
      {!result ? (
        <Form setResult={setResult} />
      ) : (
        <Result result={result} />
      )}
    </div>
  );
}

export default App;
