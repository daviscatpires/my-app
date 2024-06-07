import React from 'react';

function Result({ result }) {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Result</h2>
      <p className="text-lg">{result}</p>
      <button onClick={reloadPage} className="bg-blue-500 text-white p-2 rounded mt-4">
        OK
      </button>
    </div>
  );
}

export default Result;
