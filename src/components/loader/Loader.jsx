import React from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
    <Button disabled>
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading Data
    </Button>
  </div>
  )
}

export default Loader