import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function EnquirySuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={36} className="text-gold" />
        </div>
        <h1 className="font-serif text-3xl font-medium mb-3">Enquiry Submitted!</h1>
        <p className="font-sans text-sm text-gray-500 leading-relaxed mb-8">
          Thank you for your enquiry. Our team will review your requirements and <strong>call you within 24 hours</strong> with personalised wholesale pricing.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/dashboard" className="btn-primary">View My Enquiries</Link>
          <Link to="/catalog" className="btn-outline">Continue Browsing</Link>
        </div>
      </div>
    </div>
  )
}
