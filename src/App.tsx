import ColorPicker from '@/components/color-picker/ColorPicker';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { ThemeProvider } from '@/components/theme/theme-provider';

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center w-full max-h-12">
      <h1 className="font-bold text-2xl">Color picker</h1>
      <ModeToggle />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <body className="mx-auto h-screen flex max-w-6xl flex-col items-start justify-center gap-6 p-6 sm:p-10 overflow-hidden">
        <Header />
        <ColorPicker />
      </body>
    </ThemeProvider>
  );
}

export default App;
