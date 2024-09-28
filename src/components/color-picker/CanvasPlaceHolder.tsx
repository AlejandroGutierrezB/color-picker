export const CanvasPlaceholder = ({
  action = () => {},
}: {
  action?: () => void;
}) => {
  return (
    <div
      className="w-full h-full flex justify-center items-center bg-gray-100 dark:bg-gray-600 rounded-lg cursor-pointer"
      onClick={action}
    >
      <p className="text-gray-500 dark:text-gray-200">
        Upload an image to get started
      </p>
    </div>
  );
};
