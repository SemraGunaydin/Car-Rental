import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const [cars, setCars] = useState([]);

  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);

  // Dashboard veya API’den çağrıldığında
const fetchDashboardData = async () => {
  try {
    const { data } = await axios.get('/api/owner/dashboard');
    if (data.success) {
      setMonthlyRevenue(data.dashboardData.monthlyRevenue);
      setRecentBookings(data.dashboardData.recentBookings);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to logout the user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common['Authorization']  = '';
    toast.success("You have been logged out");
  };

  // function to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  //useeffect to retrive the token from locakstorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    fetchCars();
  }, []);

  //useeffect to fetch user data when token is available
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    monthlyRevenue,
    setMonthlyRevenue,
    recentBookings,
    setRecentBookings,
    fetchDashboardData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(AppContext)
}