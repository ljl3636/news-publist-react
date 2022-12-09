import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Button, Drawer, Tooltip, Input } from 'antd';
import { EditOutlined, LogoutOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash'
import Bar from '@/components/Bar';
import Pie from '@/components/Pie';

const { Meta } = Card;

export default function Home() {
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  const [mostView, setMostView] = useState([])
  const [mostStar, setMostStar] = useState([])
  const [barData, setBarData] = useState({})
  const [pieData, setPieData] = useState({})
  const [editName, setEditName] = useState('')
  const [editState, setEditState] = useState(false)
  //控制抽屉是否打开
  const [open, setOpen] = useState(false);
  const barRef = useRef()
  const pieRef = useRef()


  useEffect(() => {
    axios.get(`http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setMostView(res.data)
    })
    axios.get(`http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      setMostStar(res.data)
    })

    //获取所有已发布的新闻
    axios.get(`http://localhost:5000/news?publishState=2&_expand=category`).then(res => {
      /*  renderBar(_.groupBy(res.data, item => item.category.title)) */
      setBarData(_.groupBy(res.data, item => item.category.title))

      //获取自己所发布的所有新闻
      //从中过滤出作者自己的数据就可以 ，省的再发请求
      const pieDataGetByAllNews = (res.data.filter(item => item.author = username))
      setPieData(_.groupBy(pieDataGetByAllNews, item => item.category.title))
    })


    // axios.get(`http://localhost:5000/news?publishState=2&author=${username}&_expand=category`).then(res => {
    //   setPieData(_.groupBy(res.data, item => item.category.title))
    // })


  }, [username])





  //处理修改名字的回调
  const handlerInput = (e) => {
    setEditName(e.target.value)
    setEditState(false)
  }




  return (
    <div className="site-card-wrapper" >
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={mostView}
              renderItem={item => <List.Item>{<Button type='link' onClick={() => {
                //跳转到其页面，还有给浏览量+1
                navigate(`/news-manage/preview/${item.id}`)
              }}>{item.title}</Button>}</List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={mostStar}
              renderItem={item => <List.Item><Button type='link' onClick={() => {
                //跳转到其页面，还有给浏览量+1
                navigate(`/news-manage/preview/${item.id}`)
              }}>{item.title}</Button></List.Item>}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <EyeOutlined key="look" style={{ color: 'orange' }} onClick={() => setOpen(true)} />,
              editState ? <Input onBlur={(e) => handlerInput(e)} onPressEnter={handlerInput} /> : <Tooltip title='修改名字'><EditOutlined key="edit" style={{ color: '#5c7bd9' }} onClick={() => setEditState(true)} /></Tooltip>,
              <Tooltip title='退出'> <LogoutOutlined key="logout" style={{ color: 'red' }} onClick={() => {
                //清除token
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
              }} /></Tooltip>,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={editName || username}
              description={
                <div>
                  <b>{region}</b>
                  <span style={{ 'padding': 20 }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      {/*  <div ref={barRef} style={{
        height: 400,
        width: '100%',
        marginTop: 30,
      }}>
      </div> */}
      {/* 使用封装自己的Bar组件 */}
      <Bar ref={barRef} barData={barData} title='新闻分类图示' style={{
        height: 400,
        width: '100%',
        marginTop: 30,
      }} />
      <Drawer title="个人新闻数据分析" placement="right" onClose={() => setOpen(false)} open={open} width={600}>
        <Pie ref={pieRef} pieData={pieData} title='当前用户新闻分类图示' style={{
          height: 600,
          width: 600
        }} />
      </Drawer>
    </div >
  )
}
