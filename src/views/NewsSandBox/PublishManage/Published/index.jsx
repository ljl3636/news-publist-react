import React from 'react'
import NewsPublish from '@/components/NewsPublish'
import usePublish from '@/components/NewsPublish/usePublish_hooks'
export default function Published() {
  const dataSource = usePublish(2)

  return (
    <div>
      <NewsPublish dataSource={dataSource}></NewsPublish>
    </div>
  )
}
