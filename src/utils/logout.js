import { logout } from '../redux/authSlice'; // Import logout action
import { persistor } from '../redux/store'; // Import Redux persistor
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Clear user state in Redux
    persistor.purge(); // Clear persisted Redux state
    navigate('/login'); // Redirect to login page
  };

  return handleLogout;
};

export default useLogout;
