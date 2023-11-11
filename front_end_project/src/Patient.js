import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Patient = () => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const { uuid } = useParams();

  useEffect(() => {
    // Fetch list of doctors
    axios.get(`http://localhost:4000/getDoctors/${uuid}`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });

  }, [uuid]);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedSlot('');
    const selectedDoctorObj = doctors.find(doctor => doctor.id === event.target.value);
    setSlots(selectedDoctorObj?.slots || []);
  };
  
  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  //make appointment
  const handleAppointmentSubmit = () => {

  };

  //update appointment
  const handleAppointmentUpdate = () => {

  };
  

  //delete appointment
  const handleAppointmentCancel = () =>{

  }


  return (
    <div>
      <h2>Available Doctors</h2>
      <select onChange={handleDoctorChange} value={selectedDoctor}>
        <option value="">Select a doctor</option>
        {doctors.map(doctor => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>

      <h2>Your Appointments</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            Doctor: {appointment.doctor_id}, Slot: {appointment.slot_id}
            <button onClick={() => handleAppointmentUpdate(appointment.id)}>Update</button>
            <button onClick={() => handleAppointmentCancel(appointment.id)}>Cancel</button>
          </li>
        ))}
      </ul>

      {selectedDoctor && (
        <div>
          <h2>Slots for Selected Doctor</h2>
          <select onChange={handleSlotChange} value={selectedSlot}>
            <option value="">Select a slot</option>
            {doctors.find(doctor => doctor.id === selectedDoctor)?.slots.map(slot => (
              <option key={slot.id} value={slot.id}>
                {slot.time}
              </option>
            ))}
          </select>
          <button onClick={handleAppointmentSubmit}>Make Appointment</button>
        </div>
      )}
    </div>
  );
};

export default Patient;
