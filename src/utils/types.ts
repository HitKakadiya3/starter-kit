export interface TypeData {
  name: string;
  description: string;
  strengths: string[];
  careers: string;
  famous: string;
  atTheirBest: string;
  /** 0-100 baseline stress reactivity for this type (higher = more easily overwhelmed). */
  stressBaseline?: number;
}

/** Per-type baseline stress reactivity (0 = very calm, 100 = very overwhelmed). */
export const stressBaselineByType: Record<string, number> = {
  ISTJ: 30, ISFJ: 50, INFJ: 60, INTJ: 45,
  ISTP: 30, ISFP: 60, INFP: 65, INTP: 50,
  ESTP: 25, ESFP: 55, ENFP: 60, ENTP: 45,
  ESTJ: 30, ESFJ: 55, ENFJ: 55, ENTJ: 40,
};

/**
 * Per-type baseline social battery (0 = drained quickly, 100 = endless social fuel).
 * Introverts cluster lower, extraverts higher; mirrors fixtures in the spec.
 */
export const socialBatteryByType: Record<string, number> = {
  ISTJ: 30, ISFJ: 30, INFJ: 20, INTJ: 25,
  ISTP: 30, ISFP: 20, INFP: 20, INTP: 20,
  ESTP: 85, ESFP: 90, ENFP: 85, ENTP: 80,
  ESTJ: 75, ESFJ: 75, ENFJ: 70, ENTJ: 85,
};

export const typeData: Record<string, TypeData> = {
  INTJ: {
    name: 'The Strategist',
    description: 'INTJs are analytical problem-solvers who see the world as a chessboard of possibilities. They combine deep insight with relentless determination, quietly building systems and strategies that others cannot yet envision. Independent and self-assured, they hold themselves and others to exacting standards, always seeking the most efficient path forward.',
    strengths: ['Strategic thinking', 'Independence', 'Determination', 'Problem-solving', 'Vision'],
    careers: 'Software architect, scientist, attorney, strategic consultant, financial analyst',
    famous: 'Elon Musk, Friedrich Nietzsche, Nikola Tesla',
    atTheirBest: 'Designing complex systems that others cannot see yet',
  },
  INTP: {
    name: 'The Thinker',
    description: 'INTPs are curious, inventive minds driven by an insatiable desire to understand how things work. They live in a world of ideas, constantly questioning assumptions and building mental models. Quiet and reserved, they come alive when exploring theoretical puzzles and abstract concepts.',
    strengths: ['Analytical mind', 'Objectivity', 'Inventiveness', 'Open-mindedness', 'Curiosity'],
    careers: 'Data scientist, philosopher, software developer, research analyst, mathematician',
    famous: 'Albert Einstein, Marie Curie, Bill Gates',
    atTheirBest: 'Solving a theoretical problem that has stumped everyone else',
  },
  ENTJ: {
    name: 'The Leader',
    description: 'ENTJs are bold, decisive leaders who thrive on turning ambitious visions into reality. They naturally take charge, organising people and resources with confidence and efficiency. Driven by results, they challenge inefficiency wherever they find it and inspire others to meet high standards.',
    strengths: ['Leadership', 'Decisiveness', 'Confidence', 'Efficiency', 'Strategic vision'],
    careers: 'CEO, management consultant, entrepreneur, judge, university professor',
    famous: 'Steve Jobs, Margaret Thatcher, Franklin D. Roosevelt',
    atTheirBest: 'Leading a team through a complex challenge to deliver outstanding results',
  },
  ENTP: {
    name: 'The Innovator',
    description: 'ENTPs are quick-witted, resourceful thinkers who love challenging the status quo. They thrive on intellectual debate and are energised by brainstorming unconventional solutions. Charismatic and adaptable, they see every obstacle as an opportunity to innovate.',
    strengths: ['Quick thinking', 'Adaptability', 'Charisma', 'Debate skills', 'Creativity'],
    careers: 'Entrepreneur, creative director, venture capitalist, comedian, political strategist',
    famous: 'Mark Twain, Thomas Edison, Sacha Baron Cohen',
    atTheirBest: 'Generating breakthrough ideas in rapid-fire brainstorming sessions',
  },
  INFJ: {
    name: 'The Visionary',
    description: 'INFJs are deeply insightful individuals who combine empathy with a clear sense of purpose. They seek meaning in everything and are driven to help others reach their potential. Quietly intense, they possess an uncanny ability to understand people and foresee how situations will unfold.',
    strengths: ['Empathy', 'Insight', 'Idealism', 'Creativity', 'Determination'],
    careers: 'Counsellor, writer, psychologist, nonprofit director, teacher',
    famous: 'Martin Luther King Jr., Nelson Mandela, Fyodor Dostoevsky',
    atTheirBest: 'Inspiring others to work toward a shared, meaningful vision',
  },
  INFP: {
    name: 'The Idealist',
    description: 'INFPs are gentle, imaginative souls guided by deeply held personal values. They see beauty and meaning where others see the mundane, and they are driven to express their inner world through creativity. Compassionate and authentic, they seek harmony between who they are and how they live.',
    strengths: ['Empathy', 'Creativity', 'Authenticity', 'Idealism', 'Compassion'],
    careers: 'Writer, artist, therapist, social worker, UX designer',
    famous: 'William Shakespeare, J.R.R. Tolkien, Princess Diana',
    atTheirBest: 'Creating art or writing that moves people on a deep emotional level',
  },
  ENFJ: {
    name: 'The Guide',
    description: 'ENFJs are warm, inspiring leaders who genuinely care about the growth of others. They have a natural gift for bringing people together and creating a sense of shared purpose. Articulate and empathetic, they lead by encouragement and are deeply invested in the wellbeing of those around them.',
    strengths: ['Charisma', 'Empathy', 'Leadership', 'Communication', 'Altruism'],
    careers: 'Teacher, HR director, life coach, diplomat, marketing manager',
    famous: 'Barack Obama, Oprah Winfrey, Maya Angelou',
    atTheirBest: 'Mentoring someone and watching them flourish beyond expectations',
  },
  ENFP: {
    name: 'The Dreamer',
    description: 'ENFPs are enthusiastic, free-spirited individuals who see life as a canvas of possibilities. They radiate warmth and curiosity, connecting with people and ideas effortlessly. Driven by passion and imagination, they champion causes they believe in and inspire others with their infectious optimism.',
    strengths: ['Enthusiasm', 'Creativity', 'Warmth', 'Flexibility', 'Optimism'],
    careers: 'Journalist, actor, brand strategist, event planner, startup founder',
    famous: 'Robin Williams, Walt Disney, Ellen DeGeneres',
    atTheirBest: 'Rallying people around an exciting new idea with contagious energy',
  },
  ISTJ: {
    name: 'The Inspector',
    description: 'ISTJs are dependable, thorough individuals who take their responsibilities seriously. They value tradition, order, and accuracy, working steadily to fulfil their commitments. Practical and detail-oriented, they form the backbone of any organisation lucky enough to have them.',
    strengths: ['Reliability', 'Attention to detail', 'Integrity', 'Practicality', 'Discipline'],
    careers: 'Accountant, auditor, military officer, systems administrator, project manager',
    famous: 'George Washington, Angela Merkel, Warren Buffett',
    atTheirBest: 'Maintaining order and ensuring every detail is accounted for',
  },
  ISFJ: {
    name: 'The Protector',
    description: 'ISFJs are caring, dedicated individuals who quietly work behind the scenes to support those around them. They have an exceptional memory for details about the people they care about and express love through acts of service. Patient and loyal, they create stability wherever they go.',
    strengths: ['Loyalty', 'Patience', 'Supportiveness', 'Reliability', 'Observance'],
    careers: 'Nurse, teacher, librarian, social worker, office manager',
    famous: 'Mother Teresa, Queen Elizabeth II, Rosa Parks',
    atTheirBest: 'Providing steady, unwavering support to someone in need',
  },
  ESTJ: {
    name: 'The Director',
    description: 'ESTJs are decisive, organised leaders who value tradition and clear structures. They take charge naturally, setting expectations and ensuring that everyone follows through. Practical and direct, they get things done efficiently and hold themselves to high standards of responsibility.',
    strengths: ['Organisation', 'Directness', 'Responsibility', 'Loyalty', 'Leadership'],
    careers: 'Business executive, judge, school principal, military leader, financial manager',
    famous: 'Henry Ford, Sonia Sotomayor, John D. Rockefeller',
    atTheirBest: 'Organising a complex operation and delivering it on time and on budget',
  },
  ESFJ: {
    name: 'The Caretaker',
    description: 'ESFJs are warm-hearted, social individuals who thrive on creating harmony and making others feel welcome. They are attentive to the needs of those around them and find genuine satisfaction in acts of generosity. Community-minded and dependable, they are often the glue that holds groups together.',
    strengths: ['Warmth', 'Generosity', 'Cooperation', 'Social awareness', 'Dependability'],
    careers: 'Healthcare worker, event coordinator, teacher, HR specialist, real estate agent',
    famous: 'Taylor Swift, Jennifer Garner, Desmond Tutu',
    atTheirBest: 'Bringing people together and making everyone feel at home',
  },
  ISTP: {
    name: 'The Craftsman',
    description: 'ISTPs are quiet, observant individuals with a natural talent for understanding how things work. They approach the world with calm detachment, preferring to learn by doing rather than theorising. Resourceful and adaptable, they excel in hands-on situations that require quick, practical thinking.',
    strengths: ['Resourcefulness', 'Calm under pressure', 'Adaptability', 'Practical skills', 'Independence'],
    careers: 'Engineer, mechanic, forensic analyst, pilot, paramedic',
    famous: 'Clint Eastwood, Amelia Earhart, Bruce Lee',
    atTheirBest: 'Calmly troubleshooting a critical problem under intense pressure',
  },
  ISFP: {
    name: 'The Artist',
    description: 'ISFPs are gentle, sensitive individuals who experience the world through a rich inner lens of aesthetics and values. They live in the moment, appreciating beauty in all its forms and expressing themselves through action rather than words. Unassuming yet deeply passionate, they follow their own path with quiet conviction.',
    strengths: ['Aesthetic sense', 'Sensitivity', 'Flexibility', 'Loyalty', 'Passion'],
    careers: 'Graphic designer, photographer, veterinarian, chef, musician',
    famous: 'Bob Dylan, Frida Kahlo, David Bowie',
    atTheirBest: 'Creating something beautiful that perfectly captures a fleeting feeling',
  },
  ESTP: {
    name: 'The Daredevil',
    description: 'ESTPs are energetic, action-oriented individuals who live for the thrill of the moment. They are perceptive, pragmatic, and quick on their feet, preferring to dive in and figure things out as they go. Bold and direct, they bring excitement and practical solutions to every situation.',
    strengths: ['Boldness', 'Directness', 'Perceptiveness', 'Sociability', 'Practicality'],
    careers: 'Sales executive, stockbroker, firefighter, sports coach, detective',
    famous: 'Ernest Hemingway, Madonna, Eddie Murphy',
    atTheirBest: 'Seizing an opportunity in real time and turning it into a win',
  },
  ESFP: {
    name: 'The Performer',
    description: 'ESFPs are spontaneous, energetic individuals who bring joy and excitement wherever they go. They live fully in the present, embracing new experiences with open arms and infectious enthusiasm. Social and generous, they have a gift for making people laugh and feel at ease.',
    strengths: ['Spontaneity', 'Enthusiasm', 'Practicality', 'Sociability', 'Optimism'],
    careers: 'Actor, event planner, tour guide, fitness trainer, flight attendant',
    famous: 'Marilyn Monroe, Jamie Oliver, Will Smith',
    atTheirBest: 'Lighting up a room and making an ordinary moment unforgettable',
  },
};
