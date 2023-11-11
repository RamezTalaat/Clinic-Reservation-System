import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Patient = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const { uuid } = useParams();

  useEffect(() => { 
    axios.get(`http://localhost:4000/getDoctors/${uuid}`)
      .then(response => {
        setDoctors(response.data);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
    }, [uuid]);

    
    useEffect(() => {
      console.log('Selected Doctor ID (in useEffect):', selectedDoctor);
    
      if (selectedDoctor) {
        const doctorEndpoint = `http://localhost:4000/getDoctorSlots/${uuid}/${selectedDoctor}`;
    
        axios.get(doctorEndpoint)
          .then(response => {
            const doctorData = response.data;
            const doctorSlots = doctorData.slots || [];
            setDoctorSlots(doctorSlots);
          })
          .catch(error => {
            console.error('Error fetching doctor slots:', error);
          });
      }
    }, [selectedDoctor]);
    
    
    

    const renderDoctorOptions = () => {
      return doctors.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        {doctor.name}
      </option>
    ));
  };
  
  const renderSlotOptions = () => {
    return doctorSlots.map((slot) => (
      <option key={slot.id} value={slot.id}>
        {slot.date} - {slot.hour}
      </option>
    ));
  };
  
  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };
  
  //make appointment
  const handleAppointmentSubmit = () => {
    console.log(uuid);
    if (selectedDoctor && selectedSlot) {

      axios.post(`http://localhost:4000/addAppointment/${uuid}/${selectedDoctor}/${selectedSlot}`)
        .then(response => {
          console.log('Appointment made successfully:', response.data);
        })
        .catch(error => {
          console.error('Error making appointment:', error);
        });
    } else {
      console.error('Please select both a doctor and a slot before making an appointment.');
    }
  };

  //update appointment
  const handleAppointmentUpdate = () => {

  };
  

  //delete appointment
  const handleAppointmentCancel = () =>{

  }


  return (
    <div>
      <h2>Choose a Doctor</h2>
      <select value={selectedDoctor} onChange={handleDoctorChange}>
        <option value="" disabled>Select a doctor</option>
        {renderDoctorOptions()}
      </select>

      {selectedDoctor && (
        <>
          <h2>Choose a Slot</h2>
          <select value={selectedSlot} onChange={handleSlotChange}>
            <option value="" disabled>Select a slot</option>
            {renderSlotOptions()}
          </select>
        </>
      )}
      {selectedSlot && (
        <>
          <button onClick={handleAppointmentSubmit}>Make Appointment</button>
        </>
      )}
    </div>
  );
};

export default Patient;
