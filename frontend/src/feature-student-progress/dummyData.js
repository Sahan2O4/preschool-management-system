import alice from '../assets/alice.jpg';
import bob from '../assets/bob.jpg';
import charlie from '../assets/charlie.jpg';


export const students = [
  {
    id: 1,
    name: "Alice Johnson",
    photo: alice,
    class: "Grade 1",
    subjects: [
      { subject: "Math", progress: "A" },
      { subject: "English", progress: "B+" }
    ]
  },
  {
    id: 2,
    name: "Bob Smith",
    photo: bob,
    class: "Grade 2",
    subjects: [
      { subject: "Math", progress: "B" },
      { subject: "English", progress: "A-" }
    ]
  },
  {
    id: 3,
    name: "Charlie Brown",
    photo: charlie,
    class: "Grade 1",
    subjects: [
      { subject: "Math", progress: "C+" },
      { subject: "English", progress: "B" }
    ]
  }
];
