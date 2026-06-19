import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

const jobSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters.'),
  jobTitle: z.string().trim().min(2, 'Job title must be at least 2 characters.'),
  jobType: z.enum(['Full-time', 'Part-time', 'Internship']),
  status: z.enum(['Applied', 'Interviewing', 'Offered', 'Rejected']),
  appliedDate: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date.').optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer.').optional(),
})

export type JobFormData = z.infer<typeof jobSchema>

type FormErrors = Partial<Record<keyof JobFormData, string>>

type EditProps = {
  jobId: number
  initialData: JobFormData
  onSuccess?: () => void
  onClose?: () => void
}

function Edit({ jobId, initialData, onSuccess, onClose }: EditProps) {
  const [formData, setFormData] = useState<JobFormData>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const result = jobSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        companyName: fieldErrors.companyName?.[0],
        jobTitle: fieldErrors.jobTitle?.[0],
        jobType: fieldErrors.jobType?.[0],
        status: fieldErrors.status?.[0],
        appliedDate: fieldErrors.appliedDate?.[0],
        notes: fieldErrors.notes?.[0],
      })
      return
    }

    try {
      setIsSubmitting(true)
      await axios.put(`/api/updatedJob/${jobId}`, result.data)
      toast.success('Job application updated successfully')
      onSuccess?.()
      onClose?.()
    } catch {
      toast.error('Failed to update job application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Update Application</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Edit Job</h2>
          </div>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Company Name</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
              {errors.companyName && <p className="mt-1 text-sm text-rose-600">{errors.companyName}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Job Title</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
              />
              {errors.jobTitle && <p className="mt-1 text-sm text-rose-600">{errors.jobTitle}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Job Type</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                value={formData.jobType}
                onChange={(e) => handleChange('jobType', e.target.value)}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Applied Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              value={formData.appliedDate}
              onChange={(e) => handleChange('appliedDate', e.target.value)}
            />
            {errors.appliedDate && <p className="mt-1 text-sm text-rose-600">{errors.appliedDate}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              rows={4}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
            {errors.notes && <p className="mt-1 text-sm text-rose-600">{errors.notes}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Edit