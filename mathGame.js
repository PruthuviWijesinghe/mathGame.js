import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Alert, Button } from "react-bootstrap";

function MathGame() {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [imageSrc, setImageSrc] = useState("");
  const [solution, setSolution] = useState("");

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
  };

  const fetchMathProblem = async () => {
    try {
      const response = await fetch(
        "http://marcconrad.com/uob/smile/api.php?out=json&base64=yes"
      );
      const data = await response.json();
      setQuestion(data.question);
      setImageSrc(data.image);
      setSolution(data.solution);
      setCorrectAnswer(parseInt(data.solution));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMathProblem();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else {
      setScore(0);
      setTimeLeft(60);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (selectedNumber === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      fetchMathProblem();
      setSelectedNumber(null);
    }
  }, [selectedNumber, correctAnswer]);

  const renderNumberButtons = () => {
    const numbers = Array.from(Array(10).keys());
    return (
      <div className="d-flex justify-content-center mb-4">
        {numbers.map((number) => (
          <Button
            key={number}
            variant="outline-primary"
            className={`mx-2 ${
              selectedNumber === number ? "selected" : ""
            }`}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          <h2 className="mb-4">Smile Game</h2>
        </Col>
        <Col md={12}>
          <img src={`data:image/jpeg;base64,${imageSrc}`} alt="Math problem" className="img-fluid" />
        </Col>
        <Col md={12}>
          <div className="mt-4 mb-2">
            <strong>Select the correct answer:</strong>
          </div>
        </Col>
        <Col md={12}>{renderNumberButtons()}</Col>
        <Col md={12}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Score:</strong> {score}
            </div>
            <div>
              <strong>Time left:</strong> {timeLeft} seconds
            </div>
          </div>
        </Col>
        {timeLeft === 0 && (
          <Col md={12}>
            <Alert variant="danger" className="mt-4">
              Time's up! Your score is {score}.
            </Alert>
          </Col>
        )}
