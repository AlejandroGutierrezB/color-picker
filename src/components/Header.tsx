import { ModeToggle } from '@/components/theme/mode-toggle';

export const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center w-full max-h-12">
      <h1 className="font-bold text-2xl">Color picker</h1>
      <ModeToggle />
    </div>
  );
};
