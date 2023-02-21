import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import Election from '../pages/Election';

import Header from './layout/Header';
import Footer from './layout/Footer';
import Library from '../pages/Library';

function App() {
  const { provider } = configureChains([goerli], [publicProvider()]);

  const client = createClient({
    provider,
    autoConnect: true,
  });

  return (
    <BrowserRouter>
      <WagmiConfig client={client}>
        <div className="wrapper">
          <Header />
          <div className="main">
            <Routes>
              {/* <Route path="/election" element={<Election />} /> */}
              <Route path="/" element={<Library />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </WagmiConfig>
    </BrowserRouter>
  );
}

export default App;
