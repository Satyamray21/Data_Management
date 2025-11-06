import React from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from '../pages/Dashboard';
import MemberDossierForm from '../pages/MemberDossierForm';
import MissingMemberFilter from '../pages/Report'
import FestivalGreetingPage from '../pages/Greeting'

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/society" element={<MemberDossierForm />} />
        <Route path="/report" element={<MissingMemberFilter />} />
        <Route path="/greeting" element={<FestivalGreetingPage />} />
      </Route>
    </Routes>

  )
}

export default MainRoutes
