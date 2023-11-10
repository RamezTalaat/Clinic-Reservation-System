import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {

  const [userData, setUserData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('patient');
  const [UUID, setUUID] = useState(null);

  const history = useHistory();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSignUpRedirect = () => {
    history.push('/signup');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const endpoint = role === 'patient' ? 'http://localhost:4000/patientSignIn' : 'http://localhost:4000/doctorSignIn';

    try {
      const response = await axios.post(endpoint, userData);
      console.log('User is signed in:', response.data);

      setUUID(response.data.uuid);
      console.log(UUID)

      if (role === 'patient') {
      history.push(`/patient/${response.data.uuid}`);
    } else if (role === 'doctor') {
      history.push(`/doctor/${response.data.uuid}`);
    }
  }
  
  catch (error) {
    console.error('Sign-in error:', error);
  }
  
  };
  
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>mail</label>
          <input
            type="mail"
            name="email"
            value={userData.username}
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
        <button type="submit">Sign In</button>
        <button onClick={handleSignUpRedirect}>Sign Up</button>
      </form>
    </div>
  );
}


export default SignIn;
