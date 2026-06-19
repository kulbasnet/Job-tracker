import { type FormEvent, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

type AddProps = {
  onSuccess?: () => void
  onClose?: () => void
}

const jobSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters.'),
  jobTitle: z.string().trim().min(2, 'Job title must be at least 2 characters.'),
  jobType: z.enum(['Full-time', 'Part-time', 'Internship']),
  status: z.enum(['Applied', 'Interviewing', 'Offered', 'Rejected']),
  appliedDate: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date.').optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer.').optional(),
})

type JobFormData = z.infer<typeof jobSchema>

type FormErrors = Partial<Record<keyof JobFormData, string>>

const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Internship']
const STATUS_OPTIONS = ['Applied', 'Interviewing', 'Offered', 'Rejected']

function Add({ onSuccess, onClose }: AddProps) {
  const [formData, setFormData] = useState<JobFormData>({
    companyName: '',
    jobTitle: '',
    jobType: 'Full-time',
    status: 'Applied',
    appliedDate: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      await axios.post('/api/addjob', result.data)
      toast.success('Job application added successfully')
      onSuccess?.()
      onClose?.()
    } catch {
      toast.error('Failed to add job application')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">New Application</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Add Job</h2>
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
                placeholder="Google"
              />
              {errors.companyName && <p className="mt-1 text-sm text-rose-600">{errors.companyName}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Job Title</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Frontend Engineer"
              />
              {errors.jobTitle && <p className="mt-1 text-sm text-rose-600">{errors.jobTitle}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Job Type</label>
              <Combobox
                value={formData.jobType}
                onValueChange={(value) => handleChange('jobType', value ?? 'Full-time')}
                inputValue={formData.jobType}
                onInputValueChange={(value) => handleChange('jobType', value)}
              >
                <ComboboxInput
                  placeholder="Select job type"
                  showTrigger
                  className="w-full"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {JOB_TYPE_OPTIONS.map((option) => (
                      <ComboboxItem key={option} value={option}>
                        {option}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <Combobox
                value={formData.status}
                onValueChange={(value) => handleChange('status', value ?? 'Applied')}
                inputValue={formData.status}
                onInputValueChange={(value) => handleChange('status', value)}
              >
                <ComboboxInput
                  placeholder="Select status"
                  showTrigger
                  className="w-full"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {STATUS_OPTIONS.map((option) => (
                      <ComboboxItem key={option} value={option}>
                        {option}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
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
              placeholder="Anything worth remembering..."
            />
            {errors.notes && <p className="mt-1 text-sm text-rose-600">{errors.notes}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add