import { ColorPicker } from '@/components/color-picker/ColorPicker';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/theme/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="mx-auto h-screen flex max-w-6xl flex-col items-start justify-center gap-6 p-6 sm:p-10 overflow-hidden">
        <Header />
        <ColorPicker />
      </div>
    </ThemeProvider>
  );
}

export default App;
