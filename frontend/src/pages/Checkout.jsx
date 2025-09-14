import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useParams } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {sessionId} = useParams();

  const handlePaymentSuccess = async () => {
    if (!sessionId) {
      toast({
        title: 'Error',
        description: 'Invalid session ID.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sessions/payment/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        // Ignore JSON parse errors
      }

      if (res.ok) {
        toast({
          title: 'Booking Confirmed',
          description: 'Your session is successfully scheduled.',
          variant: 'default',
        });

        navigate('/student/dashboard');
      } else {
        toast({
          title: 'Payment Failed',
          description: data.error || 'Something went wrong.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Network Error',
        description: 'Could not connect to server.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 p-8">

        {/* Payment Summary */}
        <div className="md:col-span-2 text-center">
          <h1 className="text-3xl font-bold mb-4">Confirm Your Booking</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to proceed with payment and confirm your session.
          </p>

          <Button
            onClick={handlePaymentSuccess}
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-6 shadow">
          <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>Session Fee</p>
              <span>₹99</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹99</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
