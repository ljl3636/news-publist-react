import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import Particles from "particlesjs";
import './index.scss'
import axios from "axios";
export default function Login() {
    const navigate = useNavigate()
    useEffect(() => {
        Particles.init({
            selector: ".background",
            color: '#1890aa',
            sizeVariations: 10,
            speed: 1,
        });
    }, [])

    const onFinish = (values) => {
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
            res => {
                //长度为零 不存在改用户
                if (res.data.length === 0) {
                    message.error('登录失败!')
                } else {
                    localStorage.setItem('token', JSON.stringify(res.data[0]))
                    message.success('欢迎~')
                    //跳转后粒子销毁
                    Particles.destroy()
                    //存在用户 跳转至首页
                    navigate('/')
                }

            }
        )
    };
    //粒子效果
    return (
        <div style={{ 'background': 'rgb(35,39,65)', 'height': '100vh' }}>
            <canvas className="background" ></canvas>
            <div className='formContainer'>
                <div className='title' >全球新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div style={{'display':'flex','justifyContent':'space-between','width':200,'margin':'0 auto'}}>
                            <Button type="primary" htmlType="submit" className="login-form-button" >
                                登录
                            </Button>
                            <Button type="primary" className="login-form-button" onClick={()=>navigate('/news')}>
                                游客浏览
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
