const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Assessment = require('../models/Assessment.model');
const Question = require('../models/Question.model');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const assessments = [
  {
    _id: new mongoose.Types.ObjectId('654321000000000000000001'),
    title: 'Data Structures Basic Quiz',
    description: 'A fundamental quiz covering basic data structures like stacks, queues, and trees.',
    department: 'CSE',
    subjectId: 'CS201',
    difficulty: 'medium',
    durationMinutes: 20
  }
];

const questions = [
  {
    assessment: new mongoose.Types.ObjectId('654321000000000000000001'),
    text: 'Which data structure uses LIFO?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correctOptionIndex: 1,
    explanation: 'Stack follows Last-In-First-Out (LIFO) principle.'
  },
  {
    assessment: new mongoose.Types.ObjectId('654321000000000000000001'),
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctOptionIndex: 2,
    explanation: 'Binary search halves the search space each iteration, giving O(log n).'
  },
  {
    assessment: new mongoose.Types.ObjectId('654321000000000000000001'),
    text: 'Which sorting algorithm is fastest in worst case?',
    options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
    correctOptionIndex: 1,
    explanation: 'Merge sort guarantees O(n log n) in worst case.'
  }
];

const importData = async () => {
  try {
    await Assessment.create(assessments);
    await Question.create(questions);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Assessment.deleteMany();
    await Question.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide -i to import or -d to destroy data');
  process.exit();
}
