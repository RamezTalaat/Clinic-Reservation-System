/** 
 * Get doctor slots
 * 

**/


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Patient.css';

const Patient = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { UUID } = useParams();

  useEffect(() => {
    axios.get(`localhost:3000/getDoctors/${UUID}`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctors.find(doctor => doctor.id === doctorId));
    // Fetch available slots for the selected doctor
    axios.get(`api to ger doctor slots`)
      .then(response => {
        setDoctorSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctor slots:', error);
      });
  };

  const handleSlotChange = (e) => {
    const slotId = e.target.value;
    setSelectedSlot(doctorSlots.find(slot => slot.id === slotId));
  };

  const handleAppointmentBooking = () => {
    if (selectedDoctor && selectedSlot) {

      axios.post(`localhost:3000/addAppointment/${UUID}/${doctorId}/${slotId}`)
      .then(response => {
        // Handle success, maybe show a confirmation message
        console.log('Appointment booked successfully:', response.data);
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
      });
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <div>
        <label>Select a Doctor:</label>
        <select onChange={handleDoctorChange}>
          <option value="" disabled selected>Select a doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
          ))}
        </select>
      </div>
      {selectedDoctor && (
        <div>
          <label>Select a Slot:</label>
          <select onChange={handleSlotChange}>
            <option value="" disabled selected>Select a slot</option>
            {doctorSlots.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.date} - {slot.hour}</option>
            ))}
          </select>
        </div>
      )}
      <button onClick={handleAppointmentBooking} disabled={!selectedDoctor || !selectedSlot}>
        Book Appointment
      </button>
    </div>
  );
}

export default Patient;
