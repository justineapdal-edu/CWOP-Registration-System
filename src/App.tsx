import { PatientProvider } from './context/PatientContext';
import { VitalsProvider } from './context/VitalsContext';
import { MissionInfoProvider } from './context/MissionInfoContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <MissionInfoProvider>
      <PatientProvider>
        <VitalsProvider>
          <AppRoutes />
        </VitalsProvider>
      </PatientProvider>
    </MissionInfoProvider>
  );
}

export default App;
