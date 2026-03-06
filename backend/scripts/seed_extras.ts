import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LANGUAGES = ['javascript', 'python', 'java', 'cpp'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

// Templates for generation
const templates: Record<string, Record<string, any>> = {
    'javascript': {
        'EASY': [
            { bugType: 'SYNTAX', context: 'Simple array operations', buggy: 'const arr = [1,2,3];\nconsole.log(arr.length()', correct: 'const arr = [1,2,3];\nconsole.log(arr.length);', expected: '3' },
            { bugType: 'LOGICAL', context: 'String concatenation', buggy: 'let a = "hello";\nlet b = "world";\nconsole.log(a - b);', correct: 'let a = "hello";\nlet b = "world";\nconsole.log(a + " " + b);', expected: 'hello world' },
            { bugType: 'TYPE_ERROR', context: 'Addition vs Concat', buggy: 'console.log("5" * "5");', correct: 'console.log(Number("5") + Number("5"));', expected: '10' }
        ],
        'MEDIUM': [
            { bugType: 'LOGICAL', context: 'Filtering an array', buggy: 'const items = [1,2,3,4,5];\nconst evens = items.filter(x => { x % 2 === 0 });\nconsole.log(evens.length);', correct: 'const items = [1,2,3,4,5];\nconst evens = items.filter(x => x % 2 === 0);\nconsole.log(evens.length);', expected: '2' },
            { bugType: 'EDGE_CASE', context: 'Finding max', buggy: 'console.log(Math.max([1, 5, 3]));', correct: 'console.log(Math.max(...[1, 5, 3]));', expected: '5' }
        ],
        'HARD': [
            { bugType: 'LOGICAL', context: 'Async loop bug', buggy: 'async function run() {\n  let sum = 0;\n  [1, 2, 3].forEach(async (x) => {\n    sum += x;\n  });\n  console.log(sum);\n}\nrun();', correct: 'async function run() {\n  let sum = 0;\n  for(const x of [1, 2, 3]) {\n    sum += x;\n  }\n  console.log(sum);\n}\nrun();', expected: '6' }
        ]
    },
    'python': {
        'EASY': [
            { bugType: 'SYNTAX', context: 'Basic equality check', buggy: 'def is_even(n):\n  return n % 2 = 0\nprint(is_even(4))', correct: 'def is_even(n):\n  return n % 2 == 0\nprint(is_even(4))', expected: 'True' }
        ],
        'MEDIUM': [
            { bugType: 'LOGICAL', context: 'List modification while iterating', buggy: 'nums = [1,2,3,4]\nfor n in nums:\n  if n % 2 == 0:\n    nums.remove(n)\nprint(len(nums))', correct: 'nums = [1,2,3,4]\nnums = [n for n in nums if n % 2 != 0]\nprint(len(nums))', expected: '2' }
        ],
        'HARD': [
            { bugType: 'LOGICAL', context: 'Mutable default arguments', buggy: 'def append_to(num, target=[]):\n  target.append(num)\n  return target\nprint(len(append_to(1)) + len(append_to(2)))', correct: 'def append_to(num, target=None):\n  if target is None:\n      target = []\n  target.append(num)\n  return target\nprint(len(append_to(1)) + len(append_to(2)))', expected: '2' }
        ]
    },
    'java': {
        'EASY': [
            { bugType: 'SYNTAX', context: 'String comparison', buggy: 'class Main {\n  public static void main(String[] args) {\n    String a = new String("hi");\n    String b = new String("hi");\n    System.out.println(a == b);\n  }\n}', correct: 'class Main {\n  public static void main(String[] args) {\n    String a = new String("hi");\n    String b = new String("hi");\n    System.out.println(a.equals(b));\n  }\n}', expected: 'true\n' }
        ],
        'MEDIUM': [
            { bugType: 'LOGICAL', context: 'Array bounds', buggy: 'class Main {\n  public static void main(String[] args) {\n    int[] arr = {1,2,3};\n    for(int i=0; i<=arr.length; i++) System.out.print(arr[i]);\n  }\n}', correct: 'class Main {\n  public static void main(String[] args) {\n    int[] arr = {1,2,3};\n    for(int i=0; i<arr.length; i++) System.out.print(arr[i]);\n  }\n}', expected: '123' }
        ],
        'HARD': [
            { bugType: 'LOGICAL', context: 'Integer division', buggy: 'class Main {\n  public static void main(String[] args) {\n    int a = 5;\n    int b = 2;\n    double res = a / b;\n    System.out.println(res);\n  }\n}', correct: 'class Main {\n  public static void main(String[] args) {\n    int a = 5;\n    int b = 2;\n    double res = (double) a / b;\n    System.out.println(res);\n  }\n}', expected: '2.5\n' }
        ]
    },
    'cpp': {
        'EASY': [
            { bugType: 'SYNTAX', context: 'Missing semicolon or namespace', buggy: '#include <iostream>\nint main() {\n  std::cout << "Hello" << std::endl\n  return 0;\n}', correct: '#include <iostream>\nint main() {\n  std::cout << "Hello" << std::endl;\n  return 0;\n}', expected: 'Hello\n' }
        ],
        'MEDIUM': [
            { bugType: 'LOGICAL', context: 'Dangling pointer / scope issue', buggy: '#include <iostream>\nint* getPtr() {\n  int x = 5;\n  return &x;\n}\nint main() {\n  int* p = getPtr();\n  // Using p is undefined behavior\n  std::cout << "1";\n  return 0;\n}', correct: '#include <iostream>\nint* getPtr() {\n  int* x = new int(5);\n  return x;\n}\nint main() {\n  int* p = getPtr();\n  std::cout << "1";\n  delete p;\n  return 0;\n}', expected: '1' }
        ],
        'HARD': [
            { bugType: 'LOGICAL', context: 'Vector reallocation invalidating iterators', buggy: '#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> v = {1, 2, 3};\n  for (auto it = v.begin(); it != v.end(); ++it) {\n    if (*it == 2) v.push_back(4);\n  }\n  std::cout << v.size();\n  return 0;\n}', correct: '#include <iostream>\n#include <vector>\nint main() {\n  std::vector<int> v = {1, 2, 3};\n  int s = v.size();\n  for (int i=0; i<s; ++i) {\n    if (v[i] == 2) v.push_back(4);\n  }\n  std::cout << v.size();\n  return 0;\n}', expected: '4' }
        ]
    }
};

async function main() {
    console.log("Seeding real practice questions and mock debug rooms...");

    // Generate 180 questions (15 per lang per difficulty)
    let challengeCount = 0;
    for (const lang of LANGUAGES) {
        for (const diff of DIFFICULTIES) {
            const templateList = templates[lang][diff] || templates[lang]['EASY'];
            for (let i = 0; i < 15; i++) {
                // Pick a template and slightly vary it or just replicate it to hit the count
                const tmpl = templateList[i % templateList.length];
                await prisma.practiceChallenge.create({
                    data: {
                        language: lang,
                        difficulty: diff,
                        bugType: tmpl.bugType,
                        context: `${tmpl.context} Variation #${i + 1}`,
                        buggyCode: tmpl.buggy,
                        correctCode: tmpl.correct,
                        expectedOutput: tmpl.expected,
                        hint1: "Analyze the output types.",
                        hint2: "Ensure syntax is valid.",
                        hint3: "A logic error is present."
                    }
                });
                challengeCount++;
            }
        }
    }

    console.log(`Successfully generated ${challengeCount} practice challenges.`);

    // Create Mock Debug Rooms
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found to assign mock debug rooms. Create a user first.");
        return;
    }

    const room1 = await prisma.debugRoom.create({
        data: {
            title: "React useEffect fetching endlessly",
            language: "javascript",
            difficulty: "MEDIUM",
            summary: "My component goes into an infinite loop sending thousands of requests.",
            buggyCode: "useEffect(() => {\n  fetchData().then(setData);\n});",
            status: "OPEN",
            creatorId: user.id
        }
    });

    await prisma.suggestedFix.create({
        data: {
            roomId: room1.id,
            userId: user.id,
            fixedCode: "useEffect(() => {\n  fetchData().then(setData);\n}, []);",
            explanation: "You forgot the dependency array. Adding [] makes it run only once on mount.",
            isAccepted: false
        }
    });

    const room2 = await prisma.debugRoom.create({
        data: {
            title: "Python division zero error mapping",
            language: "python",
            difficulty: "HARD",
            summary: "Crashing on divide by zero.",
            buggyCode: "def div(a, b):\n  return a / b",
            status: "SOLVED",
            creatorId: user.id
        }
    });

    await prisma.suggestedFix.create({
        data: {
            roomId: room2.id,
            userId: user.id,
            fixedCode: "def div(a, b):\n  if b == 0: return 0\n  return a / b",
            explanation: "Added a guard clause for divide by zero.",
            isAccepted: true
        }
    });

    console.log("Mock debug rooms created successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
