import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,UserCircleIcon
} from '@heroicons/react/24/outline';
import { updateUser, deleteUser } from '../redux/userSlice';
import { Header } from '../utils/Header';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState('all');
  


  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5090/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const filteredMembers = filterType === 'all' 
    ? users 
    : users.filter(member => member.role === filterType);

  return (
    <div className="min-h-screen bg-white">
      {/* Top navigation */}
      {/* <nav className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          <img src="/images/logo.png" alt="ChutChutCar Logo" className="h-10" />
          <div className="space-x-4 font-myFont">
            <a href="/" className="text-blue-600">coDrive</a>
            <a href="#" className="text-gray-600">Trajets</a>
            <a href="#" className="text-gray-600">Terms of Use</a>
          </div>
        </div>
      </nav> */}
  <Header></Header>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold">Dashboard</h2>
          </div>
          <nav className="mt-2">
            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center px-6 py-3 w-full ${
                activeTab === 'members' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Members
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex items-center px-6 py-3 w-full ${
                activeTab === 'payment' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <HeartIcon className="w-5 h-5 mr-3" />
              Payment
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center px-6 py-3 w-full ${
                activeTab === 'orders' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <ShoppingBagIcon className="w-5 h-5 mr-3" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-6 py-3 w-full ${
                activeTab === 'profile' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <Cog6ToothIcon className="w-5 h-5 mr-3" />
              profile
            </button>
            <button
              onClick={() => setActiveTab('logout')}
              className={`flex items-center px-6 py-3 w-full ${
                activeTab === 'logout' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Log Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Members list</h1>
                  <p className="text-gray-600">See information about all Managers and Sellers</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  ADD MEMBER
                </button>
              </div>

              <div className="mb-6 flex justify-between">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-md ${filterType === 'all' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterType('driver')}
                    className={`px-4 py-2 rounded-md ${filterType === 'driver' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  >
                    driver
                  </button>
                  <button 
                    onClick={() => setFilterType('passenger')}
                    className={`px-4 py-2 rounded-md ${filterType === 'passenger' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  >
                    passenger
                  </button>
                </div>
                
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg">
                <div className="grid grid-cols-4 py-4 px-6 border-b border-gray-200">
                  <div className="text-gray-500 font-medium">MEMBER</div>
                  <div className="text-gray-500 font-medium">FUNCTION</div>
                  <div className="text-gray-500 font-medium">STATUS</div>
                  <div className="text-gray-500 font-medium">EMPLOYED</div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredMembers.map(member => (
                    <div key={member.id} className="grid grid-cols-4 py-4 px-6 items-center">
                      <div className="flex items-center">
                      <UserCircleIcon  className="w-10 h-10 "></UserCircleIcon>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-gray-500 text-sm">{member.email}</div>
                        </div>
                      </div>
                      <div className="text-gray-700">
                        <div>{member.role}</div>
                        <div className="text-gray-500 text-sm">verified</div>
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                          ONLINE
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-gray-700">{member.employedDate}</div>
                        <div className="flex space-x-2">
                          <button className="text-gray-400 hover:text-blue-600">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder content for other tabs */}
          {activeTab !== 'members' && (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab</h3>
              <p className="text-gray-500 mt-2">This tab is not implemented in this example</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;