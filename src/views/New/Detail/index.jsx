import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, Button, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { HeartTwoTone } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment/moment';
export default function NewsPreview() {
    const location = useLocation()
    const [newsInfo, SetNewsInfo] = useState(null)
    //设置flag鉴别是否点过赞 ，ture代表点过赞了
    const [flag, setFlag] = useState(false)
    useEffect(() => {
        axios.get(`/news/${location.pathname.split('/')[2]}?_expand=category&_expand=role`).then(res => {
            SetNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`/news/${location.pathname.split('/')[2]}`, { view: res.view + 1 })
        })
    }, [location.pathname])


    const handlerStar = () => {
       flag?message.success('已经点过赞啦~'):axios.patch(`/news/${location.pathname.split('/')[2]}`, { star: newsInfo.star + 1 }).then(res => {
            SetNewsInfo({
                ...newsInfo,
                star: newsInfo.star + 1
            })
            setFlag(true)
        })

    }

    return (
        <div>
            {
                newsInfo &&
                <div style={{ 'padding': 24, backgroundColor: '#f5f5f5' }}>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={
                            <div>{newsInfo.category.title} <Button type='link' style={{ 'marginLeft': 10, 'fontSize': 20, 'width': 30 }} size='mini' onClick={() => handlerStar()}><HeartTwoTone twoToneColor={flag?'#eb2f96':'gray'} style={{ 'marginLeft': -10 }} /></Button> </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label='创建者'>{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <hr style={{ margin: 20 }} />
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{ 'margin': '0 20px', 'minHeight': 100, 'border': '1px solid gray', 'textIndent': 20, 'backgroundColor': 'rgb(0, 0, 200,.2)', 'fontSize': 18 }}>
                    </div>
                </div>
            }
        </div>
    )
}
