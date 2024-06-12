import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';

const CampaignDetails = ({ campaign }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`/api/campaigns/${campaign.id}/logs`)
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, [campaign]);

  return (
    <Container>
      <h2>{campaign.name} - Communication Log</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Recipient</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.status}</td>
              <td>{log.recipient}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CampaignDetails;
