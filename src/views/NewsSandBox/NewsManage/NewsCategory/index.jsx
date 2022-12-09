import React, { useState, useEffect, useRef, useContext } from 'react'
import { Table, Button, Modal, Tooltip, message, Form, Input, notification } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, CheckOutlined,HighlightTwoTone } from '@ant-design/icons';
import axios from "axios";
const { confirm } = Modal;
const EditableContext = React.createContext(null);


export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const addCategory = useRef(null)
  useEffect(() => {
    axios.get('/categories').then(res => {
      setDataSource(res.data)
    })

  }, [])

  const handleSave = (record) => {
    const { title, id } = record
    //派发补丁修改title和value
    axios.patch(`/categories/${record.id}`, {
      title,
      value: title
    }).then(res => {
      setDataSource(dataSource.map(item => {
        return item.id === id ? { id, title, value: title } : item
      }))
    })
  }

  const columns = [
    {
      align: 'center',
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '栏目名称',
      align: 'center',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave: handleSave
      }),
      render: (title) => {
        return <Tooltip title="点击修改"><Button type='link' icon={<HighlightTwoTone /> }>{title}</Button></Tooltip>
         
      }
    },
    {
      align: 'center',
      title: '操作',
      render: (row) => {
        return <Tooltip title="删除">  <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => deleteHandler(row)}></Button></Tooltip>

      }
    }
  ];
  const deleteHandler = (row) => {
    confirm({
      title: `确定删除“${row.title}”栏目?`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        //通知服务器删除
        axios.delete(`/categories/${row.id}`).then(res => {
          setDataSource(dataSource.filter(item => item.id !== row.id))
          message.info(`成功删除“${row.title}”栏目!`)
        }, err => message.error(err.message))
      }

    });
  }

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };


  const onFinish = () => {
    addCategory.current.validateFields().then(res => {
      const { category } = res
      //发送给服务器添加 前 先判断是否存在之前类目，否则提示用户并返回
      if (dataSource.some(item => item.title === category))
        return message.error(`“${category}”已存在`)
      //添加成功的回调  关闭弹出框
      setOpen(false)
      axios.post(`/categories`, {
        title: category,
        value: category
      }).then(res => {
        // 本地也需要添加一项
        setDataSource([...dataSource, res.data])
        //成功添加
        notification.info({
          message: `通知`,
          description: `成功添加“${category}”类目`,
          icon: (
            <CheckOutlined
              style={{
                color: '#52c41a',
              }}
            />),
          placement: 'topRight'
        });
        //清空输入框
        addCategory.current.setFieldsValue({
          category: ''
        })
      })

    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
      <Button type='primary' icon={<PlusOutlined />} style={{ 'margin': ' 0 0 20px' }} onClick={() => setOpen(true)}>添加栏目</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(row) => row.id} bordered pagination={{
        pageSize: 5
      }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
      />;
      <Modal
        open={open}
        title='添加类别'
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpen(false)
          //清空输入框
          addCategory.current.setFieldsValue({
            category: ''
          })

        }}
        onOk={() => onFinish()}
      >
        <Form
          name="basic"
          layout="vertical"
          ref={addCategory}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="类别"
            name="category"
            rules={[{ required: true, message: '请输入新闻类别!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

