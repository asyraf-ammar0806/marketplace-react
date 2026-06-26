import { useState, useEffect } from 'react'

function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data from your fresh Django API endpoint
    fetch('http://127.0.0.1:8000/api/jobs/')
      .then(response => response.json())
      .then(data => {
        setJobs(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching jobs:", error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '20px' }}>Loading marketplace jobs...</div>

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Marketplace Job Feed</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h2>{job.title}</h2>
              <p>{job.description}</p>
              <p><strong>Budget:</strong> ${job.budget}</p>
              <small>Posted by: {job.client_username}</small>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App