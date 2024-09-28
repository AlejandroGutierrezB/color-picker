import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

export const CopyColorButton = ({
  selectedColor = '#000000',
}: {
  selectedColor: string;
}) => {
  const copyToClipboard = useCallback(() => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }
    navigator.clipboard.writeText(selectedColor).catch(console.error);
  }, [selectedColor]);

  return (
    <Button
      className="flex flex-row items-center gap-2 cursor-copy"
      onClick={copyToClipboard}
      variant="ghost"
    >
      <span className="text-justify min-w-18 tracking-wide">
        {selectedColor}
      </span>
      <div
        style={{ backgroundColor: selectedColor }}
        className="w-10 h-4 border"
      />
    </Button>
  );
};
