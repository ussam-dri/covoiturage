import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { deleteUser } from '../redux/userSlice';
import { Header } from '../utils/Header';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5090/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/editMember/${userId}`);
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/viewMember/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5090/delete-user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
      dispatch(deleteUser(userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredMembers = users
    .filter(userItem => filterType === 'all' || userItem.role === filterType)
    .filter(userItem => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        userItem.nom?.toLowerCase().includes(query) ||
        userItem.prenom?.toLowerCase().includes(query) ||
        userItem.email?.toLowerCase().includes(query) ||
        userItem.role?.toLowerCase().includes(query)
      );
    });

  const sidebarItems = [
    { id: 'members', icon: UserIcon, label: 'Members' },
    { id: 'payment', icon: HeartIcon, label: 'Payment' },
    { id: 'orders', icon: ShoppingBagIcon, label: 'Orders' },
    { id: 'profile', icon: Cog6ToothIcon, label: 'Profile' },
    { id: 'logout', icon: ArrowRightOnRectangleIcon, label: 'Log Out' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          </div>
          <nav className="mt-4">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-6 py-4 w-full transition-colors duration-200 ${
                  activeTab === item.id 
                    ? 'text-blue-600 font-medium bg-blue-50 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2 text-gray-800">Members List</h1>
                  <p className="text-gray-600">See information about all Managers and Sellers</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 shadow-sm">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  ADD MEMBER
                </button>
              </div>

              <div className="mb-6 flex flex-wrap justify-between gap-4">
                <div className="flex space-x-2">
                  {['all', 'driver', 'passenger'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                        filterType === type 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-5 py-4 px-6 border-b border-gray-200 bg-gray-50">
                  <div className="text-gray-500 font-medium">MEMBER</div>
                  <div className="text-gray-500 font-medium">FUNCTION</div>
                  <div className="text-gray-500 font-medium">EMAIL</div>
                  <div className="text-gray-500 font-medium text-right">ACTIONS</div>
                </div>
                
                {isLoading ? (
                  <div className="py-20 text-center text-gray-500">Loading members...</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMembers.length === 0 ? (
                      <div className="py-10 text-center text-gray-500">No members found</div>
                    ) : (
                      filteredMembers.map(userItem => (
                        <div key={userItem.id} className="grid grid-cols-5 py-4 px-6 items-center hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full p-1 mr-3">
                              <UserCircleIcon className="w-10 h-10 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{userItem.nom} {userItem.prenom}</div>
                            </div>
                          </div>
                          <div className="text-gray-700 font-medium">{userItem.role}</div>
                          <div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              {userItem.email}
                            </span>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button 
                              onClick={() => handleViewUser(userItem.id)}
                              className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                              title="View Details"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditUser(userItem.id)}
                              className="text-gray-400 hover:text-green-600 p-1 rounded-full hover:bg-green-50 transition-colors duration-200"
                              title="Edit Member"
                            >
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(userItem.id)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
                              title="Delete Member"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Delete confirmation modal */}
                          {deleteConfirm === userItem.id && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                                <p className="mb-6">Are you sure you want to delete {userItem.nom} {userItem.prenom}? This action cannot be undone.</p>
                                <div className="flex justify-end space-x-3">
                                  <button 
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(userItem.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab !== 'members' && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab</h3>
              <p className="text-gray-500 mt-2">This tab is not implemented in this example</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
