import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {

  const [userData, setUserData] = useState({name: '',email: '',password: '',});
  const [role, setRole] = useState('patient');
  const history = useHistory();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = role === 'patient' ? 'localhost:3000/patientSignUp' : 'localhost:3000/doctorSignUp';

    try {
      const response = await axios.post(endpoint, userData);
      console.log('User is signed in:', response.data);
      history.push('/signIn');
  } catch (error) {
      console.error('Sign-up error:', error);
    }
  
   history.push('/signIn');
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Role:</label>
          <input
            type="radio"
            name="role"
            value="patient"
            checked={role === 'patient'}
            onChange={handleRoleChange}
          />
          <label>Patient</label>
          <input
            type="radio"
            name="role"
            value="doctor"
            checked={role === 'doctor'}
            onChange={handleRoleChange}
          />
          <label>Doctor</label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
