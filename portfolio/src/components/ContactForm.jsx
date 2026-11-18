import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * ContactForm component with inline validation, accessible field errors,
 * loading simulation, and clear success message state.
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please include a project or inquiry message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }, 700);
  };

  return (
    <div className="rounded-[28px] p-6 sm:p-8 md:p-10 bg-white dark:bg-[#16171b] border border-[#e6e7eb] dark:border-[#26282e]">
      {isSubmitted ? (
        <div className="text-center py-10 px-4">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-[#101114] dark:text-white mb-2">
            Message received!
          </h3>
          <p className="text-sm text-[#62646d] dark:text-[#9ca3af] max-w-md mx-auto mb-6">
            Thank you for reaching out. I typically review incoming briefs and respond within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#f0f0f2] dark:bg-[#202126] text-[#101114] dark:text-white hover:bg-[#e4e4e7] dark:hover:bg-[#2a2b30] transition-colors focus-visible:ring-2 focus-visible:ring-[#2f4bff] dark:focus-visible:ring-[#7b8cff]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-[#62646d] dark:text-[#9ca3af] mb-2"
            >
              Your Name <span className="text-[#2f4bff] dark:text-[#7b8cff]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`w-full px-4 py-3 rounded-2xl bg-[#f7f7f8] dark:bg-[#202126] border text-sm text-[#101114] dark:text-[#f3f4f6] placeholder-[#9ca3af] transition-colors focus:bg-white dark:focus:bg-[#16171b] focus:outline-none focus:ring-2 focus:ring-[#2f4bff] dark:focus:ring-[#7b8cff] ${
                errors.name
                  ? 'border-rose-400 dark:border-rose-600'
                  : 'border-[#e6e7eb] dark:border-[#2a2b30]'
              }`}
            />
            {errors.name && (
              <p id="name-error" className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#62646d] dark:text-[#9ca3af] mb-2"
            >
              Email Address <span className="text-[#2f4bff] dark:text-[#7b8cff]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="s.jenkins@domain.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-3 rounded-2xl bg-[#f7f7f8] dark:bg-[#202126] border text-sm text-[#101114] dark:text-[#f3f4f6] placeholder-[#9ca3af] transition-colors focus:bg-white dark:focus:bg-[#16171b] focus:outline-none focus:ring-2 focus:ring-[#2f4bff] dark:focus:ring-[#7b8cff] ${
                errors.email
                  ? 'border-rose-400 dark:border-rose-600'
                  : 'border-[#e6e7eb] dark:border-[#2a2b30]'
              }`}
            />
            {errors.email && (
              <p id="email-error" className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-[#62646d] dark:text-[#9ca3af] mb-2"
            >
              Project Details <span className="text-[#2f4bff] dark:text-[#7b8cff]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your product timeline, goals, and scope..."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`w-full px-4 py-3 rounded-2xl bg-[#f7f7f8] dark:bg-[#202126] border text-sm text-[#101114] dark:text-[#f3f4f6] placeholder-[#9ca3af] transition-colors focus:bg-white dark:focus:bg-[#16171b] focus:outline-none focus:ring-2 focus:ring-[#2f4bff] dark:focus:ring-[#7b8cff] resize-none ${
                errors.message
                  ? 'border-rose-400 dark:border-rose-600'
                  : 'border-[#e6e7eb] dark:border-[#2a2b30]'
              }`}
            />
            {errors.message && (
              <p id="message-error" className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.message}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#2f4bff] dark:bg-[#7b8cff] text-white dark:text-[#0e0f12] font-semibold text-sm transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2f4bff] dark:focus-visible:ring-[#7b8cff]"
          >
            {isSubmitting ? (
              <span>Sending message...</span>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
