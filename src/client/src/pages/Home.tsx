
import { useEffect, useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Status from '@/components/status'
import Add from '@/components/add'
import Delete from '@/components/delete'
import Edit, { type JobFormData } from '@/components/edit'

type Job = {
  id: number
  companyName: string
  jobTitle: string
  jobType: string
  status: string
  appliedDate?: string
  notes?: string
}

function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Job[]>([])
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/getJobs', {
        params: { page: 1, limit: 1000 },
      })
      setJobs(response.data?.jobs || [])
    } catch {
      setError('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  const searchJobs = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await axios.get('/api/searchBy', {
        params: { term, page: 1, limit: 1000 },
      })
      setSearchResults(response.data?.searchResults || [])
    } catch {
      setSearchResults([])
    }
  }

  const displayedJobs = searchTerm.trim() ? searchResults : jobs

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      searchJobs(searchTerm)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    if (page > 1 && displayedJobs.length <= (page - 1) * itemsPerPage) {
      setPage(1)
    }
  }, [page, displayedJobs])

  const totalPages = Math.max(1, Math.ceil(displayedJobs.length / itemsPerPage))
  const paginatedJobs = displayedJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const startIndex = displayedJobs.length === 0 ? 0 : (page - 1) * itemsPerPage + 1
  const endIndex = Math.min(page * itemsPerPage, displayedJobs.length)

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Job Applications</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-9 text-sm outline-none focus:border-slate-500 sm:w-64"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button onClick={() => setIsAddOpen(true)}>+ Add Job</Button>
          </div>
        </div>

        {isAddOpen && (
          <Add
            onClose={() => setIsAddOpen(false)}
            onSuccess={() => fetchJobs()}
          />
        )}

        {editingJob && (
          <Edit
            jobId={editingJob.id}
            initialData={{
              companyName: editingJob.companyName,
              jobTitle: editingJob.jobTitle,
              jobType: editingJob.jobType,
              status: editingJob.status,
              appliedDate: editingJob.appliedDate || '',
              notes: editingJob.notes || '',
            } as JobFormData}
            onClose={() => setEditingJob(null)}
            onSuccess={() => {
              setEditingJob(null)
              fetchJobs()
            }}
          />
        )}

        {loading && <p className="px-6 py-8 text-slate-500">Loading jobs...</p>}
        {error && <p className="px-6 py-8 text-rose-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{job.companyName}</span>
                        <button
                          type="button"
                          onClick={() => setEditingJob(job)}
                          className="text-slate-900 transition hover:text-black"
                          aria-label={`Edit ${job.companyName}`}
                          style={{ fontSize: '1.2rem', fontWeight: 900 }}
                        >
                          ↗
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{job.jobTitle}</TableCell>
                    <TableCell>{job.jobType}</TableCell>
                    <TableCell>
                      <Status
                        jobId={job.id}
                        currentStatus={job.status}
                        onStatusChange={() => fetchJobs()}
                      />
                    </TableCell>
                    <TableCell>
                      {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>{job.notes || '—'}</TableCell>
                    <TableCell>
                      <Delete jobId={job.id} onDelete={() => fetchJobs()} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                <p className="text-sm text-slate-500">
                  Showing {startIndex}-{endIndex} of {displayedJobs.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home