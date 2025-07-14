import { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '../components/ui/dialog';
import { MessageCircle } from 'lucide-react';

export default function GoogleFormPopup() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip on load + every 30s
  useEffect(() => {
    const showAndHideTooltip = () => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000); // Tooltip visible for 3s
    };

    // Initial display on load
    showAndHideTooltip();

    // Repeat every 30s
    const interval = setInterval(() => {
      showAndHideTooltip();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
          {showTooltip && (
            <span className="absolute right-16 bg-white text-black px-3 py-1 rounded-md shadow-lg text-sm animate-bounce">
              💡 Give your suggestion
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl h-[80vh] overflow-hidden p-0">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf9zNlRwad0a--CdtwcczQUJ6IXJcS3-Mqxdd2DC5QXcefyCA/viewform?usp=dialog"
          title="Google Form"
          className="w-full h-full border-none rounded"
          allowFullScreen
        />
      </DialogContent>
    </Dialog>
  );
}
