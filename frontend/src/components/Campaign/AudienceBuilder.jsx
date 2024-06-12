import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const AudienceBuilder = ({ onSubmit }) => {
  const [criteria, setCriteria] = useState([{ field: '', condition: '', value: '' }]);
  const [logic, setLogic] = useState('AND');

  const addCriterion = () => {
    setCriteria([...criteria, { field: '', condition: '', value: '' }]);
  };

  const handleChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
    setCriteria(newCriteria);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    onSubmit({ criteria, logic });
  };

  return (
    <Container>
      <h2>Audience Builder</h2>
      <Form onSubmit={handleSubmit}>
        {criteria.map((criterion, index) => (
          <div key={index} className="mb-3">
            <Form.Control as="select" value={criterion.field} onChange={(e) => handleChange(index, 'field', e.target.value)} className="mr-2">
              <option value="">Select Field</option>
              <option value="totalSpends">Total Spends</option>
              <option value="maxVisits">Max Visits</option>
              <option value="lastVisit">Last Visit</option>
            </Form.Control>
            <Form.Control as="select" value={criterion.condition} onChange={(e) => handleChange(index, 'condition', e.target.value)} className="mr-2">
              <option value="">Select Condition</option>
              <option value=">">{'>'}</option>
              <option value="<">{'<'}</option>
              <option value="=">{'='}</option>
              <option value="!=">{'!='}</option>
            </Form.Control>
            <Form.Control type="text" value={criterion.value} onChange={(e) => handleChange(index, 'value', e.target.value)} className="mr-2" />
          </div>
        ))}
        <Button variant="secondary" onClick={addCriterion}>Add Criterion</Button>
        <Form.Check type="radio" label="AND" name="logic" value="AND" checked={logic === 'AND'} onChange={() => setLogic('AND')} />
        <Form.Check type="radio" label="OR" name="logic" value="OR" checked={logic === 'OR'} onChange={() => setLogic('OR')} />
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default AudienceBuilder;
