import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admissions from './pages/Admissions';
import Departments from './pages/Departments';
import Guild from './pages/Guild';
import Sports from './pages/Sports';
import Activities from './pages/Activities';
import Alumni from './pages/Alumni';
import Registry from './pages/Registry';
import Finance from './pages/Finance';
import Academic from './pages/Academic';
import Admin from './pages/Admin';
import Students from './pages/Students';
import Principal from './pages/Principal';
import Announcements from './pages/Announcements';
import About from './pages/About';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="about" element={<About />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="departments" element={<Departments />} />
        <Route path="guild" element={<Guild />} />
        <Route path="sports" element={<Sports />} />
        <Route path="activities" element={<Activities />} />
        <Route path="alumni" element={<Alumni />} />
        <Route path="academic" element={<Academic />} />
        <Route path="finance" element={<Finance />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="registry" element={<Registry />} />
        <Route path="admin" element={<Admin />} />
        <Route path="students" element={<Students />} />
        <Route path="principal" element={<Principal />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <GlobalProvider>
      <Router basename="/KITGUM-TECHNICAL-INSTITUTE-PORTAL">
        <AppRoutes />
      </Router>
    </GlobalProvider>
  );
};

export default App;
