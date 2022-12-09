import React from 'react'
import NewsPublish from '@/components/NewsPublish'
import usePublish from '@/components/NewsPublish/usePublish_hooks'

export default function Sunset() {
   
  const dataSource = usePublish(3)

  return (
    <div>
      <NewsPublish dataSource={dataSource}></NewsPublish>
    </div>
  )
}
