import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import AudienceBuilder from './components/Campaign/AudienceBuilder';
import CampaignList from './components/Campaign/CampaignList';
import CampaignDetails from './components/Campaign/CampaignDetails';

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        { (
          <>
            <Route path="/audience-builder" element={<AudienceBuilder onSubmit={(data) => console.log(data)
            } />} />
            <Route path="/campaigns" element={<CampaignList onSelect={setSelectedCampaign} />} />
            {selectedCampaign && (
              <Route path={`/campaigns/${selectedCampaign.id}`} element={<CampaignDetails campaign={selectedCampaign} />} />
            )}
            <Route path="*" element={<Navigate to="/audience-builder" />} />
          </>
        )}
        {!user && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
};

export default App;
