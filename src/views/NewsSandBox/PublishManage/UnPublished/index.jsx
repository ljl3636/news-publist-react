import React from 'react'
import NewsPublish from '@/components/NewsPublish'
import usePublish from '@/components/NewsPublish/usePublish_hooks'

export default function UnPublished() {
  const dataSource = usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource}></NewsPublish>
    </div>
  )
}
