import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

import Navbar from './components/navbar';
import { Routes } from './Routes';

function App() {
  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="p-4">
          <Routes />
        </main>
      </div>
  );
}

export default App;
library.add(fab, fas)
