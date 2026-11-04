import React from 'react';

const faqs = [
  {
    question: 'What is IskolarSpace?',
    answer: 'IskolarSpace is an AI-powered task management app built for students. It gives you one place to write down assignments, study sessions, and projects, set their priorities and deadlines, and turn them into an organized plan for your daily academic work.',
  },
  {
    question: 'Who is IskolarSpace for?',
    answer: 'It is made for students at any level who want better task organization, learners who need a clear workflow to improve their study habits, and anyone looking for a structured way to track academic progress, whether working alone or as part of a group.',
  },
  {
    question: 'How does the AI Study Planner work?',
    answer: 'The AI Study Planner uses the Google Gemini API to help you schedule your work. Describe what you need to get done, generate a study plan, and then follow it alongside the rest of your tasks and deadlines.',
  },
  {
    question: 'How does the Kanban board help me stay organized?',
    answer: 'Tasks sit in columns such as To Do, In Progress, and Done, so you can see the state of all your work at a glance. Drag a card to update its status, edit its priority and deadline, or select several finished tasks and delete them in one action.',
  },
  {
    question: 'Can I work on group projects?',
    answer: 'Yes. Create a space or join one to collaborate with other students. A task can be assigned to several members, everyone newly assigned is notified by email, and updates reach the whole group. Each space has admin and member roles, so only admins can rename or delete it, remove members, or change roles.',
  },
  {
    question: 'What is the Universe?',
    answer: 'The Universe is a shared area where you can post notes and say your thoughts out loud in space. It is a lighter corner of the app, a place to share what is on your mind with other students while you work through your tasks.',
  },
];

const Faq = () => {
  return (
    <section id="faq" className="bg-[#09090b] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-12 gap-y-12 lg:max-w-4xl lg:grid-cols-2">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="pl-6 border-l-2 border-white/10">
              <dt className="text-xl font-bold leading-7 text-white">{question}</dt>
              <dd className="mt-3 text-base leading-relaxed text-slate-400">{answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Faq;
