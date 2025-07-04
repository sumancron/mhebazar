'use client';

import Image from 'next/image';

const teamMembers = [
  {
    name: 'Mr. Ulhas Makeshwar',
    role: 'Advisor',
    description:
      'One of our esteemed Advisor at MHE Bazar. With a BE in mechanical engineering and advanced degrees in business management and marketing, Mr. Makeshwar brings a wealth of knowledge and expertise to...',
    image: '/about/advisor1.png',
  },
  {
    name: 'Mr. Manik Thapar',
    role: 'Advisor',
    description:
      'One of our valued Advisor at MHE Bazar. Mr. Thapar brings a unique blend of technical expertise and business acumen to our team, with a BE in Mechanical and Automotive Engineering and an MBA...',
    image: '/about/advisor2.png',
  },
  {
    name: 'Mr. Manik Thapar',
    role: 'Advisor',
    description:
      'One of our valued Advisor at MHE Bazar. Mr. Thapar brings a unique blend of technical expertise and business acumen to our team, with a BE in Mechanical and Automotive Engineering and an MBA...',
    image: '/about/advisor3.png',
  },
  {
    name: 'Mr. Manik Thapar',
    role: 'Advisor',
    description:
      'One of our valued Advisor at MHE Bazar. Mr. Thapar brings a unique blend of technical expertise and business acumen to our team, with a BE in Mechanical and Automotive Engineering and an MBA...',
    image: '/about/advisor4.png',
  },
];

export default function LeadershipTeam() {
  return (
    <section className="w-full bg-[#f9f9f9] py-10 px-4 md:px-8">
      <div className=" mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Leadership Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Image
                src={member.image}
                alt={member.name}
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                <p className="text-sm text-gray-700">
                  {member.description}{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Read more
                  </a>
                </p>
                <div className="mt-4">
                  <a href="#" aria-label="LinkedIn">
                    <Image
                      src="/linkedin.png"
                      alt="LinkedIn"
                      width={20}
                      height={20}
                      className="inline-block"
                    />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
