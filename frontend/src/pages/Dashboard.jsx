import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Pull the token straight out of localStorage memory
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Security Guard Check: If no token exists, immediately force-redirect to login
    if (!token) {
      navigate('/login')
      return
    }

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
  }, [token, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newJobPayload = { title, description, budget: parseFloat(budget) }

    fetch('http://127.0.0.1:8000/api/jobs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newJobPayload),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to create job")
        return response.json()
      })
      .then(createdJob => {
        setJobs([createdJob, ...jobs])
        setTitle('')
        setDescription('')
        setBudget('')
        setIsSubmitting(false)
      })
      .catch(error => {
        console.error("Error creating job:", error)
        setIsSubmitting(false)
      })
  }

  const handleLogout = () => {
    localStorage.removeItem('token') // Destroy the token string
    navigate('/login') // Redirect to login
  }

  if (loading && token) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Loading marketplace jobs...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 border-b border-gray-200 pb-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">GigSpace Marketplace</h1>
            <p className="mt-2 text-sm text-gray-600">Securely authenticated multi-page user terminal.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post a Job Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Post a New Gig</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Build an API Endpoint"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the technical requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400 cursor-pointer"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Gig'}
                </button>
              </form>
            </div>
          </div>

          {/* Live Feed Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-1">Available Contracts ({jobs.length})</h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-12 bg-white rounded-xl border border-gray-200">No jobs posted yet.</p>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">{job.title}</h3>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 shrink-0">
                      ${parseFloat(job.budget).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span>Client: <strong className="text-gray-600 font-medium">{job.client_username || 'System Admin'}</strong></span>
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard