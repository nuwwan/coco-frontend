/**
 * MarkAsPaidModal Component
 * Confirmation modal for marking salary payments as paid
 */

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  salaryPaymentInfo: string;
  salaryAmount: string;
  isLoading?: boolean;
}

const MarkAsPaidModal = ({
  isOpen,
  onClose,
  onConfirm,
  salaryPaymentInfo,
  salaryAmount,
  isLoading = false,
}: MarkAsPaidModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-3xl">💰</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Mark as Paid
          </h2>
          <p className="text-slate-400 mb-4">
            Are you sure you want to mark this salary payment as paid?
          </p>
          
          {/* Payment Details */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <p className="text-slate-300 text-sm mb-2">{salaryPaymentInfo}</p>
            <p className="text-2xl font-bold text-emerald-400">
              Rs. {parseFloat(salaryAmount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <p className="text-amber-400 text-sm">
            ⚠️ This action will update the payment status to "Paid"
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 pt-0">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="mr-2">✓</span>
                Mark as Paid
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAsPaidModal;

