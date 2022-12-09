# 使用
  1. 下载项目压缩至本地
  2. cnpm install  安装依赖  node版本 16.5.0
  3. 该项目是使用 json-server搭建后台服务器提供数据  进入项目终端  json-server --watct db.json  -p5000     端口为5000   db.jons为后台数据内容
  4. 启动项目   yarn start  / npm run start  
  5. 超级用户名 :  admin，密码 : 123456

# 简单介绍一下项目 
   1. 项目类似后台管理系统 新闻发布平台  游客可以无需登录查看新闻， 管理人员分为三类 ，admin为超级用户，可管理其它所有人员，分配权力等  
   2. 根据不同用户登录，可以显示的特权操作不同
   3. 里面用到的技术栈  react antd搭建页面结构 ，react-router-dom v6 ，redux管理状态 ，axios ， echarts可视化图表(封装), particlesjs 第三方库粒子特效 ， react-draft-wysiwyg 富文本编辑 redux-persist  持久化管理状态
   

