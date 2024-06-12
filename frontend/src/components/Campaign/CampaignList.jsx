import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const CampaignList = ({ onSelect }) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get('/api/campaigns')
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container>
      <h2>Previous Campaigns</h2>
      <ListGroup>
        {campaigns.map(campaign => (
          <ListGroup.Item key={campaign.id} action onClick={() => onSelect(campaign)}>
            {campaign.name} - {new Date(campaign.created_at).toLocaleString()}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default CampaignList;
