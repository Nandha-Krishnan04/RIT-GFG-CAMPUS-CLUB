export const problems = [
    {
        id: 1, title: 'Sum and Print', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Print the sum of two given numbers.',
        examples: 'Input: a = 5, b = 3\nOutput: 8',
        starterCode: `a = 5\nb = 3\n# Print the sum of a and b\nprint()`,
    },
    {
        id: 2, title: 'Print Coding Chef', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Print the string "Coding Chef" to the console.',
        examples: 'Output: Coding Chef',
        starterCode: `# Print "Coding Chef"\nprint()`,
    },
    {
        id: 3, title: 'Identify Correct Syntax', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Fix the syntax error in the given code so it prints "Hello World".',
        examples: 'Output: Hello World',
        starterCode: `# Fix the syntax error\nprint "Hello World")`,
    },
    {
        id: 4, title: 'Print Difference of 10 and 3', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Print the difference of 10 and 3.',
        examples: 'Output: 7',
        starterCode: `# Print the difference of 10 and 3\nprint()`,
    },
    {
        id: 5, title: 'Print String num', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Create a variable num with value 42 and print it.',
        examples: 'Output: 42',
        starterCode: `# Create variable num and print it\n`,
    },
    {
        id: 6, title: 'Print 6 divided by 2', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Print the result of 6 divided by 2 (integer division).',
        examples: 'Output: 3',
        starterCode: `# Print 6 divided by 2\nprint()`,
    },
    {
        id: 7, title: 'Two Sum', difficulty: 'Easy', xpReward: 25, world: 0, category: 'Arrays & Hashing',
        description: 'Given a list of numbers and a target, return the indices of two numbers that add up to the target.',
        examples: 'Input: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9',
        starterCode: `def two_sum(nums, target):\n    # Write your solution here\n    pass\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))`,
    },
    {
        id: 8, title: 'Reverse String', difficulty: 'Easy', xpReward: 20, world: 0, category: 'Strings',
        description: 'Write a function that reverses a string.',
        examples: 'Input: "hello"\nOutput: "olleh"',
        starterCode: `def reverse_string(s):\n    # Write your solution here\n    pass\n\n# Test\nprint(reverse_string("hello"))`,
    },
    {
        id: 9, title: 'Palindrome Check', difficulty: 'Easy', xpReward: 20, world: 0, category: 'Strings',
        description: 'Check if a given string is a palindrome.',
        examples: 'Input: "racecar"\nOutput: True',
        starterCode: `def is_palindrome(s):\n    # Write your solution here\n    pass\n\n# Test\nprint(is_palindrome("racecar"))`,
    },
    {
        id: 10, title: 'Find Maximum in Array', difficulty: 'Easy', xpReward: 25, world: 1, category: 'Arrays & Hashing',
        description: 'Find the maximum element in an array without using the built-in max function.',
        examples: 'Input: [3, 1, 4, 1, 5, 9, 2, 6]\nOutput: 9',
        starterCode: `def find_max(arr):\n    # Write your solution here\n    pass\n\n# Test\nprint(find_max([3, 1, 4, 1, 5, 9, 2, 6]))`,
    },
    {
        id: 11, title: 'Binary Search', difficulty: 'Medium', xpReward: 35, world: 1, category: 'Searching',
        description: 'Implement binary search on a sorted array. Return the index of the target or -1 if not found.',
        examples: 'Input: arr = [1, 3, 5, 7, 9], target = 5\nOutput: 2',
        starterCode: `def binary_search(arr, target):\n    # Write your solution here\n    pass\n\n# Test\nprint(binary_search([1, 3, 5, 7, 9], 5))`,
    },
    {
        id: 12, title: 'Fibonacci Sequence', difficulty: 'Medium', xpReward: 35, world: 2, category: 'Dynamic Programming',
        description: 'Generate the first n numbers of the Fibonacci sequence.',
        examples: 'Input: n = 7\nOutput: [0, 1, 1, 2, 3, 5, 8]',
        starterCode: `def fibonacci(n):\n    # Write your solution here\n    pass\n\n# Test\nprint(fibonacci(7))`,
    },
    {
        id: 13, title: 'Print 108 using 9 and 12', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Print 108 using only the numbers 9 and 12 (use multiplication).',
        examples: 'Output: 108',
        starterCode: `# Print 108 using 9 and 12\nprint()`,
    },
    {
        id: 14, title: 'Identify Incorrect Syntax', difficulty: 'Easy', xpReward: 15, world: 0, category: 'Introduction, Output and Math Operators',
        description: 'Find and fix the syntax error in the code.',
        examples: 'Output: Python is fun',
        starterCode: `# Fix the incorrect syntax\nprint('Python is fun")`,
    },
    {
        id: 15, title: 'Linked List Cycle', difficulty: 'Medium', xpReward: 40, world: 2, category: 'Linked Lists',
        description: 'Detect if a linked list has a cycle using Floyd\'s algorithm.',
        examples: 'Input: 1->2->3->4->2 (cycle)\nOutput: True',
        starterCode: `class ListNode:\n    def __init__(self, val=0):\n        self.val = val\n        self.next = None\n\ndef has_cycle(head):\n    # Write your solution here\n    pass`,
    },
    {
        id: 16, title: 'Valid Parentheses', difficulty: 'Easy', xpReward: 25, world: 1, category: 'Stacks',
        description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        examples: 'Input: "([])"\nOutput: True\n\nInput: "([)]"\nOutput: False',
        starterCode: `def is_valid(s):\n    # Write your solution here\n    pass\n\n# Test\nprint(is_valid("([])"))\nprint(is_valid("([)]"))`,
    },
];

export const debugProblems = [
    {
        id: 201, title: 'Fix the Print Statement', difficulty: 'Easy', xpReward: 20, world: 0, category: 'Debug Challenge',
        isDebug: true,
        description: 'The following code has a syntax error. Find and fix it.',
        examples: 'Expected Output: Hello, World!',
        starterCode: `# Fix the bug!\nprint("Hello, World!)`,
        bugType: 'SyntaxError',
    },
    {
        id: 202, title: 'Fix the Indentation', difficulty: 'Easy', xpReward: 20, world: 0, category: 'Debug Challenge',
        isDebug: true,
        description: 'The code has an indentation error. Fix it so it prints numbers 1 to 5.',
        examples: 'Expected Output:\n1\n2\n3\n4\n5',
        starterCode: `for i in range(1, 6):\nprint(i)`,
        bugType: 'IndentationError',
    },
    {
        id: 203, title: 'Fix the Type Error', difficulty: 'Medium', xpReward: 30, world: 1, category: 'Debug Challenge',
        isDebug: true,
        description: 'The code crashes with a TypeError. Fix it.',
        examples: 'Expected Output: The answer is 42',
        starterCode: `answer = 42\nprint("The answer is " + answer)`,
        bugType: 'TypeError',
    },
    {
        id: 204, title: 'Fix the Name Error', difficulty: 'Easy', xpReward: 20, world: 0, category: 'Debug Challenge',
        isDebug: true,
        description: 'The code has a NameError. Find and fix it.',
        examples: 'Expected Output: 10',
        starterCode: `x = 5\ny = 5\nprint(x + z)`,
        bugType: 'NameError',
    },
    {
        id: 205, title: 'Fix the Index Error', difficulty: 'Medium', xpReward: 30, world: 1, category: 'Debug Challenge',
        isDebug: true,
        description: 'The code crashes with an IndexError. Fix it.',
        examples: 'Expected Output: cherry',
        starterCode: `fruits = ["apple", "banana", "cherry"]\nprint(fruits[3])`,
        bugType: 'IndexError',
    },
    {
        id: 206, title: 'Fix the Loop Logic', difficulty: 'Medium', xpReward: 30, world: 1, category: 'Debug Challenge',
        isDebug: true,
        description: 'The code should print even numbers from 2 to 10, but has a logic bug.',
        examples: 'Expected Output:\n2\n4\n6\n8\n10',
        starterCode: `for i in range(1, 10):\n    if i % 2 == 1:\n        print(i)`,
        bugType: 'LogicError',
    },
];

export const bossProblems = [
    {
        id: 100, title: '🐉 Recursion Dragon', difficulty: 'Hard', xpReward: 200, isBoss: true, world: 2, category: 'Boss Battle',
        description: 'Implement a recursive solution to generate all permutations of a given string.',
        examples: 'Input: "abc"\nOutput: ["abc", "acb", "bac", "bca", "cab", "cba"]',
        starterCode: `def permutations(s):\n    # Defeat the Recursion Dragon!\n    # Hint: Think about breaking the problem\n    # into smaller subproblems.\n    pass\n\n# Test\nprint(permutations("abc"))`,
        hints: [
            'Think about breaking the problem into smaller subproblems.',
            'For each character, fix it and permute the rest.',
            'Base case: a single character has only one permutation.',
        ],
    },
    {
        id: 101, title: '🐲 Sorting Serpent', difficulty: 'Hard', xpReward: 250, isBoss: true, world: 3, category: 'Boss Battle',
        description: 'Implement merge sort from scratch. No built-in sort allowed!',
        examples: 'Input: [38, 27, 43, 3, 9, 82, 10]\nOutput: [3, 9, 10, 27, 38, 43, 82]',
        starterCode: `def merge_sort(arr):\n    # Defeat the Sorting Serpent!\n    pass\n\n# Test\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
        hints: [
            'Divide the array into two halves.',
            'Recursively sort each half.',
            'Merge the two sorted halves back together.',
        ],
    },
];

export const skillWorlds = [
    { name: 'Beginner Village', emoji: '🏘️', problems: 9, unlockXP: 0 },
    { name: 'Array Warrior', emoji: '⚔️', problems: 4, unlockXP: 50 },
    { name: 'Graph Explorer', emoji: '🗺️', problems: 3, unlockXP: 150 },
    { name: 'DP Master', emoji: '🧙', problems: 1, unlockXP: 300 },
    { name: 'Algorithm Grandmaster', emoji: '👑', problems: 0, unlockXP: 600 },
];

// Group problems by category for the problem list page
export function getProblemsByCategory() {
    const allProblems = [...problems, ...debugProblems, ...bossProblems];
    const grouped = {};
    allProblems.forEach(p => {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
    });
    return grouped;
}
