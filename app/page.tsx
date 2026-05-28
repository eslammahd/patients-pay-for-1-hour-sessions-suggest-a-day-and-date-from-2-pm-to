'use client'

import { useState } from 'react'

export default function Home() {
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null)

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Dr. Psychiatrist Booking Platform
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Book your psychiatric session online
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setUserType('patient')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                I'm a Patient
              </button>
              <button
                onClick={() => setUserType('doctor')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                I'm a Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userType === 'patient') {
    return <PatientBooking />
  }

  return <DoctorDashboard />
}

function PatientBooking() {
  const [step, setStep] = useState<'auth' | 'booking'>('auth')
  const [patientData, setPatientData] = useState({ name: '', email: '', phone: '' })

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Patient Information
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); setStep('booking') }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={patientData.email}
                  onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={patientData.phone}
                  onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue to Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return <BookingCalendar patientData={patientData} />
}

function BookingCalendar({ patientData }: { patientData: any }) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Generate available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = []
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  // Generate available time slots (2 PM to 11:50 PM, at least 2 hours ahead)
  const getAvailableTimeSlots = (date: string) => {
    const slots = []
    const now = new Date()
    const selectedDay = new Date(date)
    const isToday = selectedDay.toDateString() === now.toDateString()
    
    for (let hour = 14; hour <= 23; hour++) {
      for (let minutes of [0, 30]) {
        if (hour === 23 && minutes === 30) continue // Stop at 11:30 PM for 1-hour sessions
        
        const slotTime = new Date(selectedDay)
        slotTime.setHours(hour, minutes, 0, 0)
        
        // Skip if slot is less than 2 hours from now
        if (isToday && slotTime.getTime() <= now.getTime() + (2 * 60 * 60 * 1000)) {
          continue
        }
        
        const timeString = slotTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        })
        slots.push({ time: `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`, display: timeString })
      }
    }
    return slots
  }

  const handleBooking = () => {
    // Store booking data and show confirmation
    setShowConfirmation(true)
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Booking Submitted
              </h2>
              <p className="text-gray-600">
                Your session request has been sent to the doctor for confirmation.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Session Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><span className="font-medium">Patient:</span> {patientData.name}</div>
                <div><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div><span className="font-medium">Time:</span> {selectedTime} (1 hour session)</div>
                <div><span className="font-medium">Status:</span> <span className="text-yellow-600">Pending Doctor Confirmation</span></div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                You will receive an email confirmation once the doctor approves your session.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Book Another Session
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Book Your Psychiatric Session
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Date Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Date</h3>
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {getAvailableDates().map(date => {
                  const dateObj = new Date(date)
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 text-sm rounded-lg transition-colors ${
                        selectedDate === date
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="font-medium">
                        {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs opacity-75">
                        {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Time Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Time {selectedDate && `(${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`}
              </h3>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {getAvailableTimeSlots(selectedDate).map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.display)}
                      className={`p-3 text-sm rounded-lg transition-colors ${
                        selectedTime === slot.display
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {slot.display}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Please select a date first
                </div>
              )}
            </div>
          </div>
          
          {selectedDate && selectedTime && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Session Summary</h4>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div><span className="font-medium">Patient:</span> {patientData.name}</div>
                  <div><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div><span className="font-medium">Time:</span> {selectedTime} (1 hour session)</div>
                  <div><span className="font-medium">Fee:</span> To be confirmed by doctor</div>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Submit Booking Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DoctorDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  // Mock bookings data
  const mockBookings = [
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      patientEmail: 'ahmed@email.com',
      patientPhone: '+20 100 123 4567',
      date: '2024-01-15',
      time: '3:00 PM',
      status: 'pending'
    },
    {
      id: 2,
      patientName: 'Fatima Ali',
      patientEmail: 'fatima@email.com',
      patientPhone: '+20 101 234 5678',
      date: '2024-01-15',
      time: '5:30 PM',
      status: 'confirmed'
    },
    {
      id: 3,
      patientName: 'Omar Mahmoud',
      patientEmail: 'omar@email.com',
      patientPhone: '+20 102 345 6789',
      date: '2024-01-16',
      time: '2:00 PM',
      status: 'pending'
    }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Doctor Login
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); if (password === 'doctor123') setIsAuthenticated(true) }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter doctor password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Login
              </button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              Demo password: doctor123
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Doctor Dashboard
            </h2>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Session Requests</h3>
            
            <div className="space-y-4">
              {mockBookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{booking.patientName}</h4>
                      <p className="text-gray-600">{booking.patientEmail}</p>
                      <p className="text-gray-600">{booking.patientPhone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Date:</span>
                      <p className="font-medium">
                        {new Date(booking.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Time:</span>
                      <p className="font-medium">{booking.time} (1 hour)</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Session Fee:</span>
                      <p className="font-medium text-green-600">To be set</p>
                    </div>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Confirm Session
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Join Video Call
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Send Message
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600">Today's Sessions</p>
                <p className="text-2xl font-bold text-blue-800">2</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600">This Week</p>
                <p className="text-2xl font-bold text-green-800">8</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-800">2</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-800">$1,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
