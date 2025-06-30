'use client';

import { Phone, Mail, CheckCircle } from 'lucide-react';
import Breadcrumb from '@/components/elements/Breadcrumb';

const offices = [
  {
    title: 'Registered Office:',
    address: `E-228, Goyla Vihar, Block D, Lajpat Nagar I, Lajpat Nagar, New Delhi, Delhi 110024`,
    person: 'Mr. Manik Thapar',
    phone: '+91 928 909 4445',
    email: 'sales.1@mhebazar.com',
  },
  {
    title: 'Corporate Office:',
    address: `Survey no.76/1A, Poonamallee High Road, Velappanchavadi, Chennai-600077`,
    person: 'Mr. Ulias Makeshwar',
    phone: '+91 984 008 8428',
    email: 'sales.2@mhebazar.com',
  },
  {
    title: 'Branch Office:',
    address: `Plot No A-61, Next to Spree Hotel, H Block, MIDC, MIDC, Pimpri Colony, Pimpri-Chinchwad, Pune Maharashtra 411018`,
    person: 'Mr. Sumedh Ramteke',
    phone: '+91 730 5950 939',
    email: 'sumedh.ramteke@mhebazar.com',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact', href: '/contact' },
          ]}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-1">Contact us</h2>
        <p className="text-gray-700 mb-6">
          We love to hear from you! Please let us know if you have any questions or concerns and we will get back to you soon. Thank you!
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Office Cards */}
          <div className="flex-1 flex flex-col gap-4">
            {offices.map((office, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-sm">{office.title}</span>
                </div>
                <div className="text-gray-800 text-sm mb-1">{office.address}</div>
                <div className="text-gray-800 text-sm font-semibold mb-2">{office.person}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span>{office.email}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Contact Form */}
          <form
            className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 col-span-1 sm:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Company name"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Location"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Phone"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Message"
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 col-span-1 sm:col-span-2"
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded py-2 px-4 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map Embed */}
      <div className="w-full h-[350px] mt-8">
        <iframe
          title="MHE Bazar Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.184168869489!2d77.2430170754067!3d28.62433268496406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e9b7e8e0e1%3A0x6e3b1e1c9e4b9a7e!2sMHE%20Bazar!5e0!3m2!1sen!2sin!4v1688123456789!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
}
