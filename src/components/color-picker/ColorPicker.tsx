import { CanvasPlaceholder } from '@/components/color-picker/CanvasPlaceHolder';
import { CopyColorButton } from '@/components/color-picker/CopyColorButton';
import { useColorPicker } from '@/components/color-picker/hooks/useColorPicker';
import { useImageInCanvasSetup } from '@/components/color-picker/hooks/useImageInCanvasSetup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pipette } from 'lucide-react';
import { useCallback } from 'react';

export const ColorPicker: React.FC = () => {
  const { canvasRef, containerRef, image, inputRef, handleImageSelection } =
    useImageInCanvasSetup();
  const { selectedColor, isActive, toggleMagnifyingGlass } = useColorPicker(
    canvasRef,
    image
  );

  const handleClickPlaceholder = useCallback(() => {
    inputRef.current?.click();
  }, [inputRef]);

  return (
    <div className="w-full h-full bg-red flex flex-col justify-start gap-6">
      <div className="flex flex-row justify-between items-center flex-wrap">
        <Button
          className="flex flex-row items-center gap-2"
          onClick={toggleMagnifyingGlass}
          variant={isActive ? 'default' : 'ghost'}
          aria-label="Color picker"
          disabled={!image}
        >
          <Pipette size={24} />
        </Button>
        <CopyColorButton selectedColor={selectedColor} />
        <Input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={handleImageSelection}
          className="w-min max-w-64"
          ref={inputRef}
        />
      </div>
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto flex justify-center items-start"
      >
        {image ? (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{ cursor: isActive ? 'none' : 'default' }}
          />
        ) : (
          <CanvasPlaceholder action={handleClickPlaceholder} />
        )}
      </div>
    </div>
  );
};
