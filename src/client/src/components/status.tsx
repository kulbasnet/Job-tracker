import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

const STATUS_OPTIONS = [
  'Applied',
  'Interviewing',
  'Offered',
  'Rejected',
]

type StatusProps = {
  jobId: number
  currentStatus?: string
  onStatusChange?: () => void
}

function Status({ jobId, currentStatus = '', onStatusChange }: StatusProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  useEffect(() => {
    setSelectedStatus(currentStatus)
  }, [currentStatus])

  const handleStatusChange = async (value: string | null) => {
    if (!value || value === selectedStatus) return

    try {
      await axios.put(`/api/updatedJob/${jobId}`, { status: value })
      setSelectedStatus(value)
      onStatusChange?.()
      toast.success('Status updated successfully')
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <Combobox
      value={selectedStatus}
      onValueChange={handleStatusChange}
      inputValue={selectedStatus}
      onInputValueChange={(value) => setSelectedStatus(value)}
    >
      <ComboboxInput
        placeholder="Select status"
        showTrigger
        className="w-[180px]"
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
  )
}

export default Status