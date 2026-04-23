import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [reportCards, setReportCards] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#e0e0e0';
    document.body.style.margin = '0';
    document.body.style.fontFamily = 'Arial, sans-serif';
  }, []);

  const handleAddReportCard = (e) => {
    e.preventDefault();
    if (!studentName || !grade) return;

    const newCard = { id: Date.now(), studentName, grade, comments };
    setReportCards([...reportCards, newCard]);
    setStudentName('');
    setGrade('');
    setComments('');
  };

  const inputStyle = {
    padding: '10px',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px'
  };

  return (
    <div className="report-app" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Smart Report Card App</h1>

      <form
        onSubmit={handleAddReportCard}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          background: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(0,0,0,0.5)'
        }}
      >
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Grade (e.g., A, B+)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          style={{ ...inputStyle, minHeight: '60px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            cursor: 'pointer',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Add Report Card
        </button>
      </form>

      <div className="report-cards-list">
        {reportCards.length === 0 && <p>No report cards added yet.</p>}
        {reportCards.map((card) => (
          <div
            key={card.id}
            className="report-card"
            style={{
              background: '#1e1e1e',
              border: '1px solid #444',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ marginTop: 0 }}>{card.studentName}</h2>
            <p>
              <strong>Grade:</strong> {card.grade}
            </p>
            <p>
              <strong>Comments:</strong> {card.comments}
            </p>
            <button
              onClick={() => setReportCards(reportCards.filter((c) => c.id !== card.id))}
              style={{
                cursor: 'pointer',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
