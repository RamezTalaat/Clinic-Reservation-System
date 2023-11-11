import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

const Patient = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { uuid } = useParams();
  const history = useHistory();

  // Fetch patient data
  useEffect(() => {
    axios
      .get(`http://localhost:4000/getPatient/${uuid}`)
      .then((response) => {
        const patientData = response.data;
        setPatientAppointments(patientData.appointments || []);
      })
      .catch((error) => {
        console.error("Error fetching patient appointments:", error);
      });
  }, [uuid]);

  // Fetch doctors
  useEffect(() => {
    axios
      .get(`http://localhost:4000/getDoctors/${uuid}`)
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, [uuid]);

  // Fetch doctor slots
  useEffect(() => {
    if (selectedDoctor) {
      axios
        .get(`http://localhost:4000/getDoctorSlots/${uuid}/${selectedDoctor}`)
        .then((response) => {
          const doctorData = response.data;
          const doctorSlots = doctorData.slots || [];
          setDoctorSlots(doctorSlots);
        })
        .catch((error) => {
          console.error("Error fetching doctor slots:", error);
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

  const handleLogout = () => {
    history.push('/signin');
  };

  // Make or update appointment
  const handleAppointmentSubmit = () => {
    if (selectedDoctor && selectedSlot) {
      if (editMode) {
        // Update existing appointment
        if (uuid && selectedAppointment) {
          axios
            .put(
              `http://localhost:4000/updateAppointment/${uuid}/${selectedAppointment}/${selectedDoctor}/${selectedSlot}`
            )
            .then((response) => {
              console.log("Appointment updated successfully:", response.data);
              // Refresh patient appointments after updating
              refreshPatientAppointments();
            })
            .catch((error) => {
              console.error("Error updating appointment:", error);
            });
        } else {
          console.error("Missing information for updating appointment.");
        }
      } else {
        // Create a new appointment
        axios
          .post(
            `http://localhost:4000/addAppointment/${uuid}/${selectedDoctor}/${selectedSlot}`
          )
          .then((response) => {
            console.log("Appointment made successfully:", response.data);
            // Refresh patient appointments after making a new appointment
            refreshPatientAppointments();
          })
          .catch((error) => {
            console.error("Error making appointment:", error);
          });
      }
    } else {
      console.error(
        "Please select both a doctor and a slot before making an appointment."
      );
    }
  };

  // Enter edit mode
  const handleEditClick = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setEditMode(true);
    // Set selected doctor and slot based on the existing appointment
    const appointment = patientAppointments.find(
      (app) => app.id === appointmentId
    );
    if (appointment) {
      setSelectedDoctor(appointment.doctor_id);
      setSelectedSlot(appointment.slot_id);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedAppointment("");
    setSelectedDoctor("");
    setSelectedSlot("");
  };

  // Refresh patient appointments
  const refreshPatientAppointments = () => {
    axios
      .get(`http://localhost:4000/getPatient/${uuid}`)
      .then((response) => {
        const patientData = response.data;
        setPatientAppointments(patientData.appointments || []);
        setEditMode(false);
        setSelectedAppointment("");
        setSelectedDoctor("");
        setSelectedSlot("");
      })
      .catch((error) => {
        console.error("Error fetching patient appointments:", error);
      });
  };

  return (
    <div>
      <h2>Choose a Doctor</h2>
      <select value={selectedDoctor} onChange={handleDoctorChange}>
        <option value="" disabled>
          Select a doctor
        </option>
        {renderDoctorOptions()}
      </select>

      {selectedDoctor && (
        <>
          <h2>Choose a Slot</h2>
          <select value={selectedSlot} onChange={handleSlotChange}>
            <option value="" disabled>
              Select a slot
            </option>
            {renderSlotOptions()}
          </select>
        </>
      )}
      {(selectedSlot || editMode) && (
        <>
          <button onClick={handleAppointmentSubmit}>
            {editMode ? "Update Appointment" : "Make Appointment"}
          </button>
          {editMode && (
            <button onClick={handleCancelEdit}>Cancel</button>
          )}
        </>
      )}

      <h2>Patient Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Hour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patientAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.Doctor.name}</td>
              <td>{appointment.Slot.date}</td>
              <td>{appointment.Slot.hour}</td>
              <td>
                <button onClick={() => handleEditClick(appointment.id)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Patient;
