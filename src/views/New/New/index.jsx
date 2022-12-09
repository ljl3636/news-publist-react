import React, { useEffect, useState } from 'react'
import { PageHeader, Card, Col, Row, List, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import _ from 'lodash'


export default function News() {
  const [newsData, setNewsData] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      setNewsData(Object.entries(_.groupBy(res.data, item => item.category.title)));
      // console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
    })
  }, [])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
        extra={[
          <Button key="1" type="link" onClick={()=>navigate('/login')}>
            去登陆
          </Button>
        ]}
      />
      <div className="site-card-wrapper" style={{ 'padding': 20, 'width': '95%', 'margin': '0 auto' }}>
        <Row gutter={[16, 16]}>
          {
            newsData.map(item => {
              return (
                <Col span={8} key={item[0]}>
                  <Card title={item[0]} bordered hoverable style={{ 'border': '1px solid rgb(0,0,0,.2)' }} >
                    <List
                      size="small"
                      bordered
                      dataSource={item[1]}
                      pagination={{ pageSize: 2 }}
                      renderItem={data => <List.Item><Button type='link' onClick={() => navigate(`/detail/${data.id}`)}>{data.title}</Button></List.Item>}
                    />
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </div>
    </div>
  )
}
