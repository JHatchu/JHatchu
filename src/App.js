// src/App.js
import React, { useState } from 'react';
import Login from './Login';
// import UserProfile from './UserProfile';
// import PageSelector from './PageSelector';
// import PageInsights from './PageInsights';

function App() {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);

  return (
    <div className="App">
      {!user ? (
        <Login setUser={setUser} setPages={setPages} />
      ) : (
        <>
          {/* <UserProfile user={user} />
          <PageSelector pages={pages} setSelectedPage={setSelectedPage} />
          {selectedPage && <PageInsights pageId={selectedPage} />} */}
        </>
      )}
    </div>
  );
}

export default App;
