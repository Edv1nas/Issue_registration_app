import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DashboardPage = () =>{
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/v1/tokens/verify_token/${token}`);
        if (!response.ok) {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/Login');
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/tasks/tasks/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  const toggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleAddComment = async (taskId) => {
    if (!comment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/comments/task/${taskId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ comment_text: comment }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add comment');
      }

      const newComment = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { 
                ...task, 
                comments: [...task.comments, newComment]
              }
            : task
        )
      );

      setComment('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Dashboard</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
  
      <div className="container mt-5">
        <h2 className="mb-4 text-center">Submitted IT Issues</h2>
  
        {loading && <p className="text-center">Loading tickets...</p>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
  
        {!loading && !error && (
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Reporter</th>
                <th>Summary</th>
                <th>Created At</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <tr onClick={() => toggleExpand(task.id)} style={{ cursor: 'pointer' }}>
                      <td>SI-{task.id}</td>
                      <td>{task.client_email}</td>
                      <td>{task.summary}</td>
                      <td>{new Date(task.created_at).toLocaleString()}</td>
                      <td>{new Date(task.updated_at).toLocaleString()}</td>
                      <td>
                        {task.done ? (
                          <span className="badge bg-success">Done</span>
                        ) : (
                          <span className="badge bg-warning">Pending</span>
                        )}
                      </td>
                      <td>{task.assignee}</td>
                    </tr>
                    {expandedTask === task.id && (
                      <tr>
                        <td colSpan="7">
                          <div className="p-3 bg-light">
                            <h5>Description</h5>
                            <p>{task.description}</p>
  
                            <h5>Comments</h5>
                            <ul className="list-group mb-3">
                              {task.comments.length > 0 &&
                                task.comments.map((comment, index) => (
                                  <li key={index} className="list-group-item mb-3 p-2">
                                    <span style={{ color: 'blue' }}>{comment.author}</span>
                                    <span> added a comment - {new Date(comment.created_at).toLocaleString()}</span>
                                    <br />
                                    {comment.comment_text}
                                  </li>
                                ))
                              }
                            </ul>
  
                            <div className="d-flex">
                              <input
                                type="text"
                                className="form-control me-2"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              />
                              <button className="btn btn-dark" onClick={() => handleAddComment(task.id)}>
                                Add
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
