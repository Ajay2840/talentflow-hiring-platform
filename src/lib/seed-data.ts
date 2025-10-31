import { db, Job, Candidate, CandidateStage, Assessment } from './db';

const jobTitles = [
  'Senior Frontend Engineer',
  'Backend Developer',
  'Full Stack Engineer',
  'DevOps Engineer',
  'Product Manager',
  'UX Designer',
  'Data Scientist',
  'ML Engineer',
  'QA Engineer',
  'Technical Writer',
  'Engineering Manager',
  'Solutions Architect',
  'Security Engineer',
  'Mobile Developer',
  'Cloud Architect',
  'Site Reliability Engineer',
  'Business Analyst',
  'Scrum Master',
  'UI/UX Designer',
  'Marketing Manager',
  'Sales Engineer',
  'Customer Success Manager',
  'HR Manager',
  'Finance Analyst',
  'Operations Manager',
];

const tags = ['Remote', 'Onsite', 'Hybrid', 'Full-time', 'Part-time', 'Contract', 'Urgent', 'Senior', 'Junior', 'Mid-level'];

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Margaret', 'Anthony', 'Betty', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
];

const stages: CandidateStage[] = ['Applied', 'Screen', 'Tech', 'Offer', 'Hired', 'Rejected'];

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function seedDatabase() {
  try {
    // Clear existing data
    await db.transaction('rw', [db.jobs, db.candidates, db.assessments, db.assessmentResponses], async () => {
      await Promise.all([
        db.jobs.clear(),
        db.candidates.clear(),
        db.assessments.clear(),
        db.assessmentResponses.clear(),
      ]);
    });

    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Seed Jobs
    const jobs: Job[] = jobTitles.map((title, index) => ({
      id: `job-${index + 1}`,
      title,
      slug: generateSlug(title),
      status: Math.random() > 0.3 ? 'active' : 'archived',
      tags: randomElements(tags, Math.floor(Math.random() * 3) + 1),
      description: `We are looking for an experienced ${title} to join our team.`,
      order: index,
      createdAt: randomDate(threeMonthsAgo, now),
      updatedAt: randomDate(threeMonthsAgo, now),
    }));

    await db.jobs.bulkAdd(jobs);

    // Seed Candidates
    const candidates: Candidate[] = [];
    const activeJobs = jobs.filter(j => j.status === 'active');

    for (let i = 0; i < 1000; i++) {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const job = randomElement(activeJobs);
      
      candidates.push({
        id: `candidate-${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        jobId: job.id,
        stage: randomElement(stages),
        appliedAt: randomDate(threeMonthsAgo, now),
        notes: Math.random() > 0.7 ? 'Strong candidate with relevant experience' : undefined,
      });
    }

    await db.candidates.bulkAdd(candidates);

    // Role-specific question banks
    const roleBanks: Record<string, { technical: { q: string; options: string[]; answer: string }[] } > = {
      'Frontend': {
        technical: [
          { q: 'Which hook is used for memoizing values?', options: ['useMemo', 'useEffect', 'useRef', 'useCallback'], answer: 'useMemo' },
          { q: 'Which CSS layout is best for 2D grids?', options: ['Float', 'Flexbox', 'Grid', 'Table'], answer: 'Grid' },
          { q: 'What does key prop help with in React lists?', options: ['Styling', 'Performance/reconciliation', 'Routing', 'Accessibility'], answer: 'Performance/reconciliation' },
        ]
      },
      'Backend': {
        technical: [
          { q: 'Which HTTP status means Unprocessable Entity?', options: ['400', '401', '403', '422'], answer: '422' },
          { q: 'ACID: what does I stand for?', options: ['Isolation', 'Iteration', 'Integrity', 'Indirection'], answer: 'Isolation' },
          { q: 'Best way to store passwords?', options: ['Plain text', 'Symmetric encryption', 'Salted hash (bcrypt/argon2)', 'Base64'], answer: 'Salted hash (bcrypt/argon2)' },
        ]
      },
      'Data': {
        technical: [
          { q: 'Which algorithm reduces dimensionality?', options: ['KNN', 'PCA', 'Naive Bayes', 'Apriori'], answer: 'PCA' },
          { q: 'What is overfitting?', options: ['High bias', 'High variance', 'Low variance', 'Perfect generalization'], answer: 'High variance' },
          { q: 'Which metric for imbalanced classes?', options: ['Accuracy', 'Precision/Recall', 'MAE', 'R²'], answer: 'Precision/Recall' },
        ]
      },
      'DevOps': {
        technical: [
          { q: 'Blue/Green deployment benefit?', options: ['Zero-downtime releases', 'Cheaper servers', 'No tests required', 'Manual rollbacks only'], answer: 'Zero-downtime releases' },
          { q: 'IaC tool?', options: ['Webpack', 'Terraform', 'Express', 'Jest'], answer: 'Terraform' },
          { q: 'Container orchestrator?', options: ['Kubernetes', 'Selenium', 'Nginx', 'Electron'], answer: 'Kubernetes' },
        ]
      },
      'Design': {
        technical: [
          { q: 'Primary goal of usability testing?', options: ['Visual appeal', 'Identify user pain points', 'Code coverage', 'SEO rank'], answer: 'Identify user pain points' },
          { q: 'What is WCAG?', options: ['Accessibility guidelines', 'Animation library', 'Design tool', 'Layout engine'], answer: 'Accessibility guidelines' },
          { q: 'What is a persona?', options: ['A real customer', 'Fictional archetype user', 'Stakeholder', 'Developer'], answer: 'Fictional archetype user' },
        ]
      },
      'PM': {
        technical: [
          { q: 'Backlog prioritization technique?', options: ['MoSCoW', 'DFS', 'A*', 'LRU'], answer: 'MoSCoW' },
          { q: 'What is a KPI?', options: ['Key Performance Indicator', 'Known Product Issue', 'Kanban Planning Item', 'Key Process Interaction'], answer: 'Key Performance Indicator' },
          { q: 'Which framework is flow-based?', options: ['Scrum', 'Kanban', 'Waterfall', 'PERT'], answer: 'Kanban' },
        ]
      }
    };

    const detectRole = (title: string): keyof typeof roleBanks => {
      const t = title.toLowerCase();
      if (t.includes('front') || t.includes('ui')) return 'Frontend';
      if (t.includes('back') || t.includes('server') || t.includes('api')) return 'Backend';
      if (t.includes('data') || t.includes('ml')) return 'Data';
      if (t.includes('devops') || t.includes('sre') || t.includes('cloud')) return 'DevOps';
      if (t.includes('design') || t.includes('ux')) return 'Design';
      if (t.includes('product') || t.includes('pm')) return 'PM';
      return 'Frontend';
    };

    // Seed Assessments with more roles and role-specific questions
    const assessments: Assessment[] = activeJobs.slice(0, 10).map((job, index) => ({
      id: `assessment-${index + 1}`,
      jobId: job.id,
      title: `${job.title} Assessment`,
      description: `Role-specific assessment for ${job.title}`,
      sections: [
        {
          id: `section-${index}-1`,
          title: 'Technical Skills',
          description: 'Evaluate role-specific competencies',
          order: 0,
          questions: [
            // inject role-specific questions first
            ...roleBanks[detectRole(job.title)].technical.map((item, i) => ({
              id: `rq-${index}-${i}`,
              type: 'multi-choice',
              question: item.q,
              required: true,
              options: item.options,
              correctAnswer: item.answer,
              order: i,
            })),
            {
              id: `q-${index}-1`,
              type: 'multi-choice',
              question: 'What is the output of this JavaScript code: console.log(typeof([]));',
              required: true,
              options: ['array', 'object', 'undefined', 'string'],
              correctAnswer: 'object',
              order: 10,
            },
            {
              id: `q-${index}-2`,
              type: 'multi-choice',
              question: 'In React, which hook is used to perform side effects?',
              required: true,
              options: ['useEffect', 'useState', 'useContext', 'useReducer'],
              correctAnswer: 'useEffect',
              order: 11,
            },
            {
              id: `q-${index}-3`,
              type: 'multi-choice',
              question: 'What does CSS stand for?',
              required: true,
              options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
              correctAnswer: 'Cascading Style Sheets',
              order: 12,
            },
            {
              id: `q-${index}-4`,
              type: 'multi-choice',
              question: 'Which HTTP method is idempotent?',
              required: true,
              options: ['GET', 'POST', 'PATCH', 'DELETE'],
              correctAnswer: 'GET',
              order: 13,
            },
            {
              id: `q-${index}-5`,
              type: 'multi-choice',
              question: 'What is the time complexity of a binary search?',
              required: true,
              options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
              correctAnswer: 'O(log n)',
              order: 14,
            },
            {
              id: `q-${index}-6`,
              type: 'multi-choice',
              question: 'What is the purpose of the "use strict" directive in JavaScript?',
              required: true,
              options: [
                'Enforces stricter parsing and error handling',
                'Makes the code run faster',
                'Enables new JavaScript features',
                'Disables all error checking'
              ],
              correctAnswer: 'Enforces stricter parsing and error handling',
              order: 15,
            },
            {
              id: `q-${index}-7`,
              type: 'multi-choice',
              question: 'Which of these is NOT a valid way to declare a variable in JavaScript?',
              required: true,
              options: ['let x = 1;', 'var y = 2;', 'const z = 3;', 'variable w = 4;'],
              correctAnswer: 'variable w = 4;',
              order: 16,
            },
            {
              id: `q-${index}-8`,
              type: 'multi-choice',
              question: 'What is the difference between == and === in JavaScript?',
              required: true,
              options: [
                '== checks value equality, === checks value and type equality',
                'They are exactly the same',
                '=== is deprecated',
                '== is more strict than ==='
              ],
              correctAnswer: '== checks value equality, === checks value and type equality',
              order: 17,
            },
            {
              id: `q-${index}-9`,
              type: 'multi-choice',
              question: 'What is the purpose of the virtual DOM in React?',
              required: true,
              options: [
                'To improve performance by minimizing actual DOM updates',
                'To store user data',
                'To handle routing',
                'To manage state'
              ],
              correctAnswer: 'To improve performance by minimizing actual DOM updates',
              order: 18,
            },
            {
              id: `q-${index}-10`,
              type: 'multi-choice',
              question: 'What is a closure in JavaScript?',
              required: true,
              options: [
                'A function that has access to variables in its outer scope',
                'A way to close browser windows',
                'A method to end loops',
                'A type of error handling'
              ],
              correctAnswer: 'A function that has access to variables in its outer scope',
              order: 19,
            },
            {
              id: `q-${index}-11`,
              type: 'multi-choice',
              question: 'What is the purpose of TypeScript?',
              required: true,
              options: [
                'To add static typing to JavaScript',
                'To make JavaScript run faster',
                'To replace JavaScript completely',
                'To handle HTTP requests'
              ],
              correctAnswer: 'To add static typing to JavaScript',
              order: 20,
            },
            {
              id: `q-${index}-12`,
              type: 'multi-choice',
              question: 'What is Redux used for?',
              required: true,
              options: [
                'State management',
                'Database management',
                'Server-side rendering',
                'CSS preprocessing'
              ],
              correctAnswer: 'State management',
              order: 21,
            },
            {
              id: `q-${index}-13`,
              type: 'multi-choice',
              question: 'What is CORS?',
              required: true,
              options: [
                'A security feature that restricts cross-origin HTTP requests',
                'A CSS framework',
                'A JavaScript runtime',
                'A database management system'
              ],
              correctAnswer: 'A security feature that restricts cross-origin HTTP requests',
              order: 22,
            },
            {
              id: `q-${index}-14`,
              type: 'multi-choice',
              question: 'What is the purpose of webpack?',
              required: true,
              options: [
                'To bundle and manage web assets',
                'To test JavaScript code',
                'To deploy applications',
                'To manage databases'
              ],
              correctAnswer: 'To bundle and manage web assets',
              order: 23,
            },
            {
              id: `q-${index}-15`,
              type: 'multi-choice',
              question: 'What is the difference between props and state in React?',
              required: true,
              options: [
                'Props are read-only and passed from parent, state is internal and mutable',
                'Props are mutable, state is immutable',
                'Props are for styling, state is for data',
                'There is no difference'
              ],
              correctAnswer: 'Props are read-only and passed from parent, state is internal and mutable',
              order: 24,
            },
          ],
        },
        {
          id: `section-${index}-2`,
          title: 'Programming Questions',
          description: 'Coding and problem-solving questions',
          order: 1,
          questions: [
            {
              id: `q-${index}-16`,
              type: 'multi-choice',
              question: 'How do you implement a Stack data structure?',
              required: true,
              options: [
                'Using an array with push() and pop()',
                'Using a linked list with add() and remove()',
                'Using a hash table',
                'Using a binary tree'
              ],
              correctAnswer: 'Using an array with push() and pop()',
              order: 0,
            },
            {
              id: `q-${index}-17`,
              type: 'multi-choice',
              question: 'What is the best case time complexity of QuickSort?',
              required: true,
              options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(1)'],
              correctAnswer: 'O(n log n)',
              order: 1,
            },
            {
              id: `q-${index}-18`,
              type: 'multi-choice',
              question: 'Which data structure would you use to implement a cache?',
              required: true,
              options: [
                'Hash Map with LRU implementation',
                'Array',
                'Linked List',
                'Binary Search Tree'
              ],
              correctAnswer: 'Hash Map with LRU implementation',
              order: 2,
            },
            {
              id: `q-${index}-19`,
              type: 'multi-choice',
              question: 'What is the main advantage of using a Binary Search Tree?',
              required: true,
              options: [
                'Efficient searching and sorting',
                'Memory efficiency',
                'Easy implementation',
                'Constant time operations'
              ],
              correctAnswer: 'Efficient searching and sorting',
              order: 3,
            },
            {
              id: `q-${index}-20`,
              type: 'multi-choice',
              question: 'How would you detect a cycle in a linked list?',
              required: true,
              options: [
                'Using Floyd\'s cycle-finding algorithm',
                'Using a counter',
                'Using recursion',
                'Using a stack'
              ],
              correctAnswer: "Using Floyd's cycle-finding algorithm",
              order: 4,
            },
            {
              id: `q-${index}-21`,
              type: 'multi-choice',
              question: 'What is the purpose of dynamic programming?',
              required: true,
              options: [
                'To solve complex problems by breaking them into simpler subproblems',
                'To write self-modifying code',
                'To improve code readability',
                'To handle runtime errors'
              ],
              correctAnswer: 'To solve complex problems by breaking them into simpler subproblems',
              order: 5,
            },
            {
              id: `q-${index}-22`,
              type: 'multi-choice',
              question: 'What is the difference between BFS and DFS?',
              required: true,
              options: [
                'BFS explores breadth-wise, DFS explores depth-wise',
                'BFS is faster than DFS',
                'DFS uses less memory than BFS',
                'There is no difference'
              ],
              correctAnswer: 'BFS explores breadth-wise, DFS explores depth-wise',
              order: 6,
            },
            {
              id: `q-${index}-23`,
              type: 'multi-choice',
              question: 'What is a hash collision?',
              required: true,
              options: [
                'When two different keys hash to the same value',
                'When a hash function fails',
                'When memory runs out',
                'When data is corrupted'
              ],
              correctAnswer: 'When two different keys hash to the same value',
              order: 7,
            },
            {
              id: `q-${index}-24`,
              type: 'multi-choice',
              question: 'What is the purpose of the Big O notation?',
              required: true,
              options: [
                'To describe the worst-case performance of an algorithm',
                'To measure code quality',
                'To count the lines of code',
                'To track memory usage'
              ],
              correctAnswer: 'To describe the worst-case performance of an algorithm',
              order: 8,
            },
            {
              id: `q-${index}-25`,
              type: 'multi-choice',
              question: 'What is recursion?',
              required: true,
              options: [
                'A function that calls itself',
                'A loop statement',
                'An error handling mechanism',
                'A data structure'
              ],
              correctAnswer: 'A function that calls itself',
              order: 9,
            },
            {
              id: `q-${index}-26`,
              type: 'multi-choice',
              question: 'What is memoization?',
              required: true,
              options: [
                'Caching the results of expensive function calls',
                'Writing documentation',
                'Organizing code into modules',
                'Testing code'
              ],
              correctAnswer: 'Caching the results of expensive function calls',
              order: 10,
            },
            {
              id: `q-${index}-27`,
              type: 'multi-choice',
              question: 'What is the difference between a stack and a queue?',
              required: true,
              options: [
                'Stack is LIFO, Queue is FIFO',
                'Stack is slower than Queue',
                'Queue uses more memory',
                'There is no difference'
              ],
              correctAnswer: 'Stack is LIFO, Queue is FIFO',
              order: 11,
            },
            {
              id: `q-${index}-28`,
              type: 'multi-choice',
              question: 'What is a greedy algorithm?',
              required: true,
              options: [
                'An algorithm that makes locally optimal choices',
                'An algorithm that uses lots of memory',
                'An algorithm that runs slowly',
                'An algorithm with bugs'
              ],
              correctAnswer: 'An algorithm that makes locally optimal choices',
              order: 12,
            },
            {
              id: `q-${index}-29`,
              type: 'multi-choice',
              question: 'What is the purpose of unit testing?',
              required: true,
              options: [
                'To verify individual units of code work correctly',
                'To check code style',
                'To improve performance',
                'To generate documentation'
              ],
              correctAnswer: 'To verify individual units of code work correctly',
              order: 13,
            },
            {
              id: `q-${index}-30`,
              type: 'multi-choice',
              question: 'What is the difference between merge sort and quick sort?',
              required: true,
              options: [
                'Merge sort is stable, quick sort is not',
                'Merge sort is faster',
                'Quick sort uses less memory',
                'There is no difference'
              ],
              correctAnswer: 'Merge sort is stable, quick sort is not',
              order: 14,
            }
          ],
        },
        {
          title: 'Behavioral Questions',
          description: 'Assess cultural fit and soft skills',
          order: 2,
          id: `section-${index}-3`,
          questions: [
            {
              id: `q-${index}-31`,
              type: 'multi-choice',
              question: 'How do you handle conflicts in a team?',
              required: true,
              options: [
                'Address issues directly and professionally',
                'Avoid confrontation',
                'Escalate to management immediately',
                'Wait for others to resolve it'
              ],
              correctAnswer: 'Address issues directly and professionally',
              order: 0,
            },
            {
              id: `q-${index}-32`,
              type: 'multi-choice',
              question: 'How do you prioritize your tasks?',
              required: true,
              options: [
                'Use importance and urgency matrix',
                'Work on whatever comes first',
                'Ask others what to do',
                'Focus on easy tasks first'
              ],
              correctAnswer: 'Use importance and urgency matrix',
              order: 1,
            },
            {
              id: `q-${index}-33`,
              type: 'multi-choice',
              question: 'How do you handle tight deadlines?',
              required: true,
              options: [
                'Break down tasks and communicate progress',
                'Work overtime without telling anyone',
                'Cut corners to meet deadline',
                'Ask for extension immediately'
              ],
              correctAnswer: 'Break down tasks and communicate progress',
              order: 2,
            },
            {
              id: `q-${index}-34`,
              type: 'multi-choice',
              question: 'How do you stay updated with new technologies?',
              required: true,
              options: [
                'Regular learning and practice',
                'Wait for work training',
                'Learn only when required',
                'Rely on others\' knowledge'
              ],
              correctAnswer: 'Regular learning and practice',
              order: 3,
            },
            {
              id: `q-${index}-35`,
              type: 'multi-choice',
              question: 'How do you handle criticism?',
              required: true,
              options: [
                'Take it constructively and improve',
                'Defend against all criticism',
                'Ignore it completely',
                'Get upset and defensive'
              ],
              correctAnswer: 'Take it constructively and improve',
              order: 4,
            },
            {
              id: `q-${index}-36`,
              type: 'multi-choice',
              question: 'How do you contribute to team meetings?',
              required: true,
              options: [
                'Actively participate and share ideas',
                'Listen quietly unless asked',
                'Dominate the conversation',
                'Attend but work on other things'
              ],
              correctAnswer: 'Actively participate and share ideas',
              order: 5,
            },
            {
              id: `q-${index}-37`,
              type: 'multi-choice',
              question: 'How do you handle working with difficult team members?',
              required: true,
              options: [
                'Find common ground and maintain professionalism',
                'Avoid working with them',
                'Complain to management',
                'Match their difficult behavior'
              ],
              correctAnswer: 'Find common ground and maintain professionalism',
              order: 6,
            },
            {
              id: `q-${index}-38`,
              type: 'multi-choice',
              question: 'How do you manage work-life balance?',
              required: true,
              options: [
                'Set clear boundaries and priorities',
                'Work comes first always',
                'Personal life comes first',
                'No separation between work and life'
              ],
              correctAnswer: 'Set clear boundaries and priorities',
              order: 7,
            },
            {
              id: `q-${index}-39`,
              type: 'multi-choice',
              question: 'How do you handle project setbacks?',
              required: true,
              options: [
                'Analyze, learn, and adjust approach',
                'Give up and start over',
                'Blame others',
                'Hide the setback'
              ],
              correctAnswer: 'Analyze, learn, and adjust approach',
              order: 8,
            },
            {
              id: `q-${index}-40`,
              type: 'multi-choice',
              question: 'How do you approach learning new technologies?',
              required: true,
              options: [
                'Systematic learning with practical application',
                'Read documentation only',
                'Try without learning',
                'Avoid new technologies'
              ],
              correctAnswer: 'Systematic learning with practical application',
              order: 9,
            },
            {
              id: `q-${index}-41`,
              type: 'multi-choice',
              question: 'How do you handle stress at work?',
              required: true,
              options: [
                'Use stress management techniques and prioritize',
                'Ignore it until it goes away',
                'Take frequent sick days',
                'Let it affect your work'
              ],
              correctAnswer: 'Use stress management techniques and prioritize',
              order: 10,
            },
            {
              id: `q-${index}-42`,
              type: 'multi-choice',
              question: 'How do you contribute to team culture?',
              required: true,
              options: [
                'Be positive and support colleagues',
                'Focus only on your work',
                'Let others handle culture',
                'Complain about issues'
              ],
              correctAnswer: 'Be positive and support colleagues',
              order: 11,
            },
            {
              id: `q-${index}-43`,
              type: 'multi-choice',
              question: 'How do you handle multiple competing priorities?',
              required: true,
              options: [
                'Assess impact and urgency, communicate with stakeholders',
                'Work on what seems most urgent',
                'First come, first served',
                'Ask others to decide'
              ],
              correctAnswer: 'Assess impact and urgency, communicate with stakeholders',
              order: 12,
            },
            {
              id: `q-${index}-44`,
              type: 'multi-choice',
              question: 'How do you ensure code quality in your work?',
              required: true,
              options: [
                'Follow best practices and review thoroughly',
                'Rely on others to check',
                'Focus on speed over quality',
                'Only fix if problems arise'
              ],
              correctAnswer: 'Follow best practices and review thoroughly',
              order: 13,
            },
            {
              id: `q-${index}-45`,
              type: 'multi-choice',
              question: 'How do you handle disagreements about technical decisions?',
              required: true,
              options: [
                'Discuss objectively with data and examples',
                'Push your solution strongly',
                'Give in to avoid conflict',
                'Escalate to management'
              ],
              correctAnswer: 'Discuss objectively with data and examples',
              order: 14,
            }
          ],
        },
      ],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    }));

    await db.assessments.bulkAdd(assessments);

    console.log('Database seeded successfully!');
    console.log(`- ${jobs.length} jobs`);
    console.log(`- ${candidates.length} candidates`);
    console.log(`- ${assessments.length} assessments`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
