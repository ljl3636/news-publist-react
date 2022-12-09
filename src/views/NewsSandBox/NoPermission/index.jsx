import { Empty } from 'antd';

const NoPermission = () => {

  return (
    <div>
      <Empty description={<b style={{ 'fontSize': 24,'fontStyle':'italic' }}>404 Not Found !  </b>} imageStyle={{ 'marginTop': 100, height: '100%' }} />
    </div>

  )
};
export default NoPermission