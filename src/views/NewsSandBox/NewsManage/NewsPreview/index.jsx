import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
export default function NewsPreview() {
    const location = useLocation()
    const [newsInfo, SetNewsInfo] = useState(null)
    useEffect(() => {
        axios.get(`/news/${location.pathname.split('/')[3]}?_expand=category&_expand=role`).then(res => {
            SetNewsInfo(res.data)
        })
    }, [location.pathname])

    const auditList = ['未审核', '待审核', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['black', 'orange', '#52c41a', 'red']
    return (
        <div>
            {
                newsInfo &&
                <div style={{ 'padding': 24, backgroundColor: '#f5f5f5' }}>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label='创建者'>{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态" ><span style={{ 'color': colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态" ><span style={{ 'color': colorList[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    <hr style={{ margin: 20 }} />
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{ 'margin': '0 20px','minHeight':100,'border':'1px solid gray','textIndent':20 ,'backgroundColor':'rgb(0, 0, 200,.2)','fontSize':18}}>
                    </div>
                </div>
            }
        </div>
    )
}
