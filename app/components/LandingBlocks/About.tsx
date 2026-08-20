import React from 'react';

const About = () => {
  return (
    <section id="about" className='bg-[#09090b] py-24 sm:py-32 relative overflow-hidden'>
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl lg:max-w-4xl text-center" data-aos="fade-up">
          <h2 className="text-base font-semibold text-indigo-400 font-rajdhani tracking-[0.2em] uppercase">
            About Our Mission
          </h2>
          <p className="mt-4 text-4xl/tight sm:text-5xl/tight font-bold tracking-tight text-white font-syncopate">
            Empowering Students Globally
          </p>
          <p className="mt-6 text-xl/8 text-slate-300 font-rajdhani font-light">
            <strong className="text-white font-medium">IskolarSpace</strong> is a dynamic and revolutionary platform built by a dedicated programmer for fellow students worldwide. Our mission is to transform the way users interact, study, and organize their daily routines.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl" data-aos="fade-up" data-aos-delay="200">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="relative pl-6 border-l-2 border-white/10 hover:border-indigo-500 transition-colors duration-500 group">
              <dt className="text-xl font-bold leading-7 text-white font-rajdhani group-hover:text-indigo-400 transition-colors">
                Create Dedicated Spaces
              </dt>
              <dd className="mt-3 text-base leading-relaxed text-slate-400 font-rajdhani">
                Whether you are looking to create dedicated study environments for coursework or manage intense project collaborations, IskolarSpace provides the ultimate ecosystem to keep you organized and focused on your goals.
              </dd>
            </div>
            <div className="relative pl-6 border-l-2 border-white/10 hover:border-cyan-500 transition-colors duration-500 group">
              <dt className="text-xl font-bold leading-7 text-white font-rajdhani group-hover:text-cyan-400 transition-colors">
                Streamline Task Management
              </dt>
              <dd className="mt-3 text-base leading-relaxed text-slate-400 font-rajdhani">
                Effortlessly streamline your personal task management with our built-in tools. IskolarSpace breaks down complexities so you can dedicate more time to actual learning and producing outstanding results.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default About;
