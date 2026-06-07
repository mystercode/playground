import FloatingDaisies from './components/FloatingDaisies';
import BirthdayCard from './components/BirthdayCard';
import DownloadButton from './components/DownloadButton';

export default function App() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <FloatingDaisies />
      <BirthdayCard name="Courtney" age={24} />
      <DownloadButton />
    </div>
  );
}
