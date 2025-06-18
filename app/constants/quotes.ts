

export const quotes = [
    "Success is the sum of small efforts, repeated day in and day out.",
  "Your future is created by what you do today, not tomorrow.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Don’t stop until you’re proud.",
  "Discipline is the bridge between goals and accomplishment.",
  "Strive for progress, not perfection.",
  "Dream big, work hard, stay focused.",
  "The secret to getting ahead is getting started.",
  "Every expert was once a beginner.",
  "Small steps lead to big achievements.",
  "You don’t have to be perfect, just keep moving forward.",
  "Education is the most powerful weapon you can use to change the world.",
  "The journey of a thousand miles begins with a single step.",
  "Consistency is the key to success.",
  "Push yourself, because no one else will do it for you.",
  "Opportunities don’t happen, you create them.",
  "Success doesn’t come from what you do occasionally, but from what you do consistently.",
  "Your only limit is your mind.",
  "Believe you can, and you're halfway there.",
  "Make today count; it brings you one step closer to your goals."
]

export const getRandomQuote = () => {
     return quotes[Math.floor(Math.random() * quotes.length)];
}