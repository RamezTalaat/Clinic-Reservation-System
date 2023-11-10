import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Doctor.css';

const Doctor = () => {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', hour: '' });
  const { uuid } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  useEffect(() => {
    axios.get(`http://localhost:4000/getDoctor/${uuid}`)
      .then((response) => {
        const {  slots } = response.data;

        setSlots(slots || []);
      })
      .catch((error) => {
        console.error('Error slots:', error);
      });
  }, [uuid]);

  const addSlot = () => {
    axios.post(`http://localhost:4000/addSlot/${uuid}`, newSlot)
      .then((response) => {
        setSlots([...slots, response.data]);
        setNewSlot({ date: '', hour: '' });
      })
      .catch((error) => {
        console.error('Error adding doctor slot:', error);
      });
  };

  return (
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
        <button type="button" onClick={addSlot}>
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default Doctor;
