import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Form, Navbar, Nav, Container, Row, Col, Carousel } from 'react-bootstrap';
import './Home.css';

const Home = () => {
    const history = useNavigate();
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('');
    const [commentText, setCommentText] = useState('');
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        history('/'); // Redirect to the login page
    };
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/trips');
                setTrips(response.data);
            } catch (error) {
                console.error('Error fetching trips', error);
            }
        };
        fetchTrips();
    }, [token]);
    const fetchTrips = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips', error);
      }
    };
    const handleAskQuestion = async () => {
        if (!selectedTrip || !commentText.trim()) return;
        try {
            await axios.post(`http://localhost:3000/api/comments/add`, {
                tripId: selectedTrip._id,
                text: commentText
            }, { headers: { Authorization: `Bearer ${token}` } });
            fetchTrips();
            setCommentText('');
            setShowModal(false);
        } catch (error) {
            console.error('Error posting comment', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:3000/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchTrips();
        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };

    const handleSeeMore = (trip, e) => {
      e.stopPropagation(); // Prevent the event from bubbling up to the parent elements
      setSelectedTrip(trip);
      setShowModal(true);
  };
  

    const filteredTrips = trips.filter(trip => trip.category.includes(filter));

    return (
      <div className="home-container">
          <Navbar bg="primary" variant="dark">
              <Container>
              <Navbar.Brand className="mx-center ml-auto" href="#home">Tour the world</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="ml-auto">
                          <Button variant="light" onClick={handleLogout}>Logout</Button>
                      </Nav>
                  </Navbar.Collapse>
                  
                  {userRole === 'admin' && (
                      <Nav className="ml-auto">
                          <Nav.Link href="/trip-managament">Trip Managament</Nav.Link>
                      </Nav>
                  )}
              </Container>
          </Navbar>

          <Container className="my-4 d-flex justify-content-center">
              <Row>
                  <Col xs={12} className="text-center">
                      <h3>Find Your Next Adventure</h3>
                  </Col>
              </Row>
              <Row className="my-4">
                  <Col xs={12} className="text-center">
                      <Form.Select onChange={e => setFilter(e.target.value)}>
                          <option value="">Filter by Continent</option>
                          <option value="Africa">Africa</option>
                          <option value="Antarctica">Antarctica</option>
                          <option value="Asia">Asia</option>
                          <option value="Europe">Europe</option>
                          <option value="North America">North America</option>
                          <option value="Oceania">Oceania</option>
                          <option value="South America">South America</option>
                      </Form.Select>
                  </Col>
              </Row>
              <Row className="mb-4">
                  <Col xs={12} className='text-center'>
                      <Carousel controls={true} indicators={true} pause={false}>
                          {filteredTrips.map(trip => (
                              <Carousel.Item key={trip._id}>
                                  <Card className="card-sm"> {/* Added class card-sm to make the card smaller */}
                                      <Card.Img variant="top" src={trip.destinationImage} alt={trip.title} />
                                      <Card.Body>
                                          <Card.Title>{trip.title}</Card.Title>
                                          <Card.Text>{trip.description}</Card.Text>
                                          <Card.Text>Category: {trip.category}</Card.Text>
                                          <Card.Text>Start Date: {new Date(trip.startDate).toLocaleDateString()}</Card.Text>
                                          <Card.Text>End Date: {new Date(trip.endDate).toLocaleDateString()}</Card.Text>
                                          <Button variant="info" className="ms-2" onClick={(e) => handleSeeMore(trip, e)}>See More</Button>
                                      </Card.Body>
                                  </Card>
                              </Carousel.Item>
                          ))}
                      </Carousel>
                  </Col>
              </Row>
          </Container>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                  <Modal.Title>{selectedTrip?.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <p>{selectedTrip?.description}</p>
                  {selectedTrip?.comments.map(comment => (
                      <div key={comment._id}>
                          <strong>Comment:</strong> {comment.user.username + " " + comment.text}
                          {userRole === 'admin' && (
                              <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
                          )}
                      </div>
                  ))}
                  {userRole === 'user' && (
                      <Form>
                          <Form.Group>
                              <Form.Label>Ask a Question</Form.Label>
                              <Form.Control type="text" placeholder="Enter your question" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                          </Form.Group>
                          <Button variant="primary" onClick={handleAskQuestion}>Ask</Button>
                      </Form>
                  )}
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
              </Modal.Footer>
          </Modal>
      </div>
  );
};

export default Home;
