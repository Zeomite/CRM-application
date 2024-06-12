import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';


const Login = ({ onLogin }) => {
    const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  
  useEffect(() => {

    const fetchCsrfToken = async () => {
        try {
          const response = await axios.get('/api/csrf-token');
          setCsrfToken(response.data.csrfToken);

        } catch (error) {
          console.error('Failed to fetch CSRF token:', error);
        }
      };
  
      fetchCsrfToken();
    
  }, []);

  const handleGoogleSuccess = (credentialResponse) => {
    axios.post('/api/auth/google', { token: credentialResponse.credential }, { headers: { 'X-CSRF-Token': csrfToken } })
      .then(res => onLogin(res.body))
      .catch(err => setErrorMessage(err.response?.body?.message || 'An error occurred.'));
  };

  const handleGoogleFailure = (error) => {
    setErrorMessage('Google login failed.');
    console.error(error);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, email, password } = event.target.elements;
    axios.post('/api/customers/login', { name: name.value, email: email.value, password: password.value })
      
      .then(res => {
        if (res.status === 201) {
            navigate('/campaign', { state: { user: res.body } }); 
          }
        onLogin(res.body)
    })
      .catch(err => setErrorMessage(err.response?.body?.message || 'Invalid credentials.'));
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} > 
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="justify-content-center w-100">
          <Col md={4}>
            <h2 className="text-center">Login</h2>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" required />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="email" required />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password" required />
              </Form.Group>
              <Button variant="primary" type="submit"className="w-100 mt-3"> 
                Login 
              </Button>
            </Form>
            <hr />
            <GoogleLogin clientId= {process.env.REACT_APP_GOOGLE_CLIENT_ID}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              buttonText="Login with Google"
              className="w-100"
            />
          </Col>
        </Row>
      </Container>
      </GoogleOAuthProvider>
  );
};

export default Login;
