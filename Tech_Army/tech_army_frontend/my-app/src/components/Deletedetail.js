import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeletedDetail = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, users]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/userss/'); // Adjust the URL to match your Django endpoint
      
      // Sort users by 'created_at' or 'updated_at' to show the most recent first (LIFO)
      const sortedUsers = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Replace 'created_at' with your actual date field
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      const filtered = users.filter(user => 
        user.userid.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
    setCurrentPage(1); // Reset to first page after search
  };

  // Handle delete action
  const handleDelete = async (userid) => {
    try {
      await axios.delete(`http://localhost:8000/api/userss/${userid}/`); // Adjust the URL for your delete endpoint
      const updatedUsers = users.filter((user) => user.userid !== userid);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter((user) => 
        user.userid.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Calculate pagination details
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: currentPage === i ? '#538392' : '#f0f0f0',
            color: currentPage === i ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '3px'
          }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <h2>User Details</h2>
      <input
        type="text"
        placeholder="Search by User ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          marginBottom: '20px',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          width: '300px'
        }}
      />
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Person Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.userid}>
              <td>{user.userid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.personstatus}</td>
              <td>
                <button onClick={() => handleDelete(user.userid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        {renderPageNumbers()}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DeletedDetail;
