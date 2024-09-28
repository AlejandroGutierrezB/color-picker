import useImageInCanvasSetup from '@/components/color-picker/hooks/useImageInCanvasSetup';
import { Input } from '@/components/ui/input';

const ColorPicker: React.FC = () => {
  const { canvasRef, containerRef, image, inputRef, handleImageSelection } =
    useImageInCanvasSetup();

  return (
    <div className="w-full h-full bg-red flex flex-col justify-start gap-6">
      <div className="flex flex-row justify-between items-center flex-wrap">
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
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-100 dark:bg-gray-600 rounded-lg">
            <p
              className="text-gray-500 dark:text-gray-200 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              Upload an image to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
