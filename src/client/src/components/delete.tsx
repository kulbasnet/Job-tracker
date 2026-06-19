import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type DeleteProps = {
  jobId: number
  onDelete?: () => void
}

function Delete({ jobId, onDelete }: DeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await axios.delete(`/api/deleteJob/${jobId}`)
      toast.success('Job deleted successfully')
      onDelete?.()
      setShowConfirm(false)
    } catch {
      toast.error('Failed to delete job')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        aria-label="Delete job application"
      >
        <Trash2 className="size-4" />
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete job?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Delete