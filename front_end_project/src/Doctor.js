import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Doctor.css';

const Doctor = () => {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', hour: '' });
  const { UUID } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  useEffect(() => {
    axios.get('getSlots')
      .then((response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        console.error('Error fetching doctor slots:', error);
      });
  }, []);

  const addSlot = () => {
    axios.post(`localhost:3000/addSlot/${UUID}/2`, newSlot)
      .then((response) => {
        setSlots([...slots, response.data]);
        setNewSlot({ date: '', hour: '' });
      })
      .catch((error) => {
        console.error('Error adding doctor slot:', error);
      });
  };


  return(
    <div>
      <h2>Available Doctor Slots</h2>
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>{slot.date} - {slot.hour}</li>
        ))}
      </ul>
      <h2>Add Doctor Slot</h2>
      <form>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={newSlot.date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="hour"
            value={newSlot.hour}
            onChange={handleInputChange}
          />
        </div>
      <button type="button" onClick={addSlot}>Add Slot</button>
      </form>
    </div>



  );
}

export default Doctor;
