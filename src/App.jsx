import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from '@/context/TransactionContext';
import { ClaimProvider } from '@/context/ClaimContext';
import { NotificationProvider } from '@/context/NotificationContext';
import NotificationToastLayer from '@/components/NotificationToastLayer';
import InvestigationFlowRunner from '@/components/InvestigationFlowRunner';
import HomeDashboardScreen from '@/pages/HomeDashboardScreen';
import ActivityScreen from '@/pages/ActivityScreen';
import AkunAnda from '@/pages/AkunAnda';
import ClaimLanding from '@/pages/ClaimLanding';
import ComplaintMethodSelect from '@/pages/ComplaintMethodSelect';
import ClaimForm from '@/pages/ClaimForm';
import ClaimSuccess from '@/pages/ClaimSuccess';
import ClaimHistory from '@/pages/ClaimHistory';
import ClaimDetail from '@/pages/ClaimDetail';
import RebuttalForm from '@/pages/RebuttalForm';
import Bantuan from '@/pages/Bantuan';
import KomplainSPBU from '@/pages/KomplainSPBU';
import TransactionDetail from '@/pages/TransactionDetail';
import NotificationInboxPage from '@/pages/NotificationInboxPage';
import PesanPage from '@/pages/PesanPage';

function App() {
  return (
    <TransactionProvider>
      <ClaimProvider>
        <NotificationProvider>
          <Router>
            {/* Persistent flow runner — survives all page navigation */}
            <InvestigationFlowRunner />
            {/* Global push notification toast overlay */}
            <NotificationToastLayer />

            <Routes>
              {/* Main App Shell */}
              <Route path="/" element={<HomeDashboardScreen />} />
              <Route path="/aktivitas" element={<ActivityScreen />} />
              <Route path="/aktivitas/transaksi/:transactionId" element={<TransactionDetail />} />
              <Route path="/akun-anda" element={<AkunAnda />} />
              <Route path="/bantuan" element={<Bantuan />} />
              <Route path="/notifikasi" element={<Navigate to="/pesan" replace />} />
              <Route path="/pesan" element={<PesanPage />} />
              <Route path="/komplain" element={<KomplainSPBU />} />

              {/* Fuel Complaint Flow */}
              <Route path="/komplain-bbm" element={<ClaimLanding />} />
              <Route path="/komplain-bbm/pilih-metode" element={<ComplaintMethodSelect />} />
              <Route path="/komplain-bbm/form" element={<ClaimForm />} />
              <Route path="/komplain-bbm/sukses" element={<ClaimSuccess />} />
              <Route path="/komplain-bbm/riwayat" element={<ClaimHistory />} />
              <Route path="/komplain-bbm/:claimId" element={<ClaimDetail />} />
              <Route path="/komplain-bbm/:claimId/edit" element={<ClaimForm />} />
              <Route path="/komplain-bbm/:claimId/sanggahan" element={<RebuttalForm />} />

              {/* Legacy redirects for old /claim/* paths */}
              <Route path="/claim" element={<Navigate to="/komplain-bbm" replace />} />
              <Route path="/claim/history" element={<Navigate to="/komplain-bbm/riwayat" replace />} />
              <Route path="/claim/submit" element={<Navigate to="/komplain-bbm/form" replace />} />
              <Route path="/claim/success" element={<Navigate to="/komplain-bbm/sukses" replace />} />
              <Route path="/claim/:claimId" element={<Navigate to="/komplain-bbm/:claimId" replace />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </ClaimProvider>
    </TransactionProvider>
  );
}

export default App;
