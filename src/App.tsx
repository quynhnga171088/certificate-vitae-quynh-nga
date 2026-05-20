import { useLocation } from 'react-router-dom';
import Home from './pages/home';
import TheSystemFromUserVision from './pages/TheSystemFromUserVision';
import { parseQueryParams } from './utils/util';

const App = () => {
  
  const location = useLocation();
  const search = location.search;
  const params = parseQueryParams(search);

  const page = params.page || '';

  if (page) {
    if (page === 'hieu-he-thong-tu-goc-nhin-user-khung-phan-tich') {
      return <TheSystemFromUserVision />;
    } else {
      return <Home />;
    }
  } else {
    return <Home />;
  }
};

export default App;
