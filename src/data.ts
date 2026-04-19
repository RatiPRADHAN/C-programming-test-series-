import { Level } from './types';

export const LEVELS: Level[] = [
  {
    id: 'level-0',
    name: 'LEVEL 0 — Primitive Semantics',
    description: 'The absolute basics of prefix and postfix operators.',
    theory: 'Prefix (++x) increments first, then returns. Postfix (x++) returns first, then increments.',
    tricks: ['++x: "New value"', 'x++: "Old value"'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `l0-t${i + 1}`,
      levelId: 'level-0',
      name: `Test ${i + 1}: Basic Basics`,
      questions: [
        {
          id: `l0-t${i + 1}-q1`,
          testId: `l0-t${i + 1}`,
          code: `int x = ${i + 5};\nint y = ++x;\nprintf("%d %d", x, y);`,
          options: [
            { id: 'A', text: `${i + 5} ${i + 6}` },
            { id: 'B', text: `${i + 6} ${i + 6}` },
            { id: 'C', text: `${i + 6} ${i + 5}` },
            { id: 'D', text: `${i + 5} ${i + 5}` }
          ],
          correctAnswer: 'B',
          explanation: 'Prefix increment: x is incremented before assignment.',
          category: 'Prefix'
        },
        {
          id: `l0-t${i + 1}-q2`,
          testId: `l0-t${i + 1}`,
          code: `int x = ${i + 10};\nint y = x++;\nprintf("%d %d", x, y);`,
          options: [
            { id: 'A', text: `${i + 11} ${i + 10}` },
            { id: 'B', text: `${i + 10} ${i + 11}` },
            { id: 'C', text: `${i + 11} ${i + 11}` },
            { id: 'D', text: `${i + 10} ${i + 10}` }
          ],
          correctAnswer: 'A',
          explanation: 'Postfix increment: x is incremented after assignment.',
          category: 'Postfix'
        },
        {
          id: `l0-t${i + 1}-q3`,
          testId: `l0-t${i + 1}`,
          code: `int x = 1;\nint y = ++x + 5;\nprintf("%d", y);`,
          options: [
            { id: 'A', text: '6' },
            { id: 'B', text: '7' },
            { id: 'C', text: '5' },
            { id: 'D', text: '8' }
          ],
          correctAnswer: 'B',
          explanation: 'Prefix happens before addition.',
          category: 'Arithmetic'
        },
        {
          id: `l0-t${i + 1}-q4`,
          testId: `l0-t${i + 1}`,
          code: `int x = 20;\nprintf("%d", x--);`,
          options: [
            { id: 'A', text: '19' },
            { id: 'B', text: '20' },
            { id: 'C', text: '21' },
            { id: 'D', text: 'UB' }
          ],
          correctAnswer: 'B',
          explanation: 'Postfix decrement: returns old value.',
          category: 'Postfix'
        },
        {
          id: `l0-t${i + 1}-q5`,
          testId: `l0-t${i + 1}`,
          code: `int x = 5;\nint y = --x;\nprintf("%d", y);`,
          options: [
            { id: 'A', text: '5' },
            { id: 'B', text: '4' },
            { id: 'C', text: '6' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'B',
          explanation: 'Prefix decrement: increments down then returns.',
          category: 'Prefix'
        }
      ]
    }))
  },
  {
    id: 'level-1',
    name: 'LEVEL 1 — Sequential Composition',
    description: 'Tracking state across multiple statements.',
    theory: 'Semicolons are sequence points. Side effects are completed before the next line.',
    tricks: ['Draw a variable table.', 'Update values line by line.'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `l1-t${i + 1}`,
      levelId: 'level-1',
      name: `Test ${i + 1}: Multi-step Logic`,
      questions: [
        {
          id: `l1-t${i + 1}-q1`,
          testId: `l1-t${i + 1}`,
          code: `int x = 5;\nx++;\n++x;\nprintf("%d", x);`,
          options: [
            { id: 'A', text: '5' },
            { id: 'B', text: '6' },
            { id: 'C', text: '7' },
            { id: 'D', text: '8' }
          ],
          correctAnswer: 'C',
          explanation: 'Two increments on separate lines are clearly sequential.',
          category: 'Sequence'
        },
        {
          id: `l1-t${i + 1}-q2`,
          testId: `l1-t${i + 1}`,
          code: `int x = 2;\nint y = x++;\nint z = ++x;\nprintf("%d", y + z);`,
          options: [
            { id: 'A', text: '6' },
            { id: 'B', text: '5' },
            { id: 'C', text: '7' },
            { id: 'D', text: '4' }
          ],
          correctAnswer: 'A',
          explanation: 'y=2, x becomes 3. Then x becomes 4, z=4. 2+4=6.',
          category: 'Sequence'
        },
        {
          id: `l1-t${i + 1}-q3`,
          testId: `l1-t${i + 1}`,
          code: `int x = 10;\nint y = --x;\nx++;\nprintf("%d", y);`,
          options: [
            { id: 'A', text: '9' },
            { id: 'B', text: '10' },
            { id: 'C', text: '11' },
            { id: 'D', text: '8' }
          ],
          correctAnswer: 'A',
          explanation: 'y is 9. The subsequent x++ does not affect y.',
          category: 'Variables'
        },
        {
          id: `l1-t${i + 1}-q4`,
          testId: `l1-t${i + 1}`,
          code: `int x = 0;\nx++;\nx++;\nx++;\nprintf("%d", x--);`,
          options: [
            { id: 'A', text: '2' },
            { id: 'B', text: '3' },
            { id: 'C', text: '4' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'B',
          explanation: 'x starts at 0, goes to 3. Postfix return 3.',
          category: 'Sequence'
        },
        {
          id: `l1-t${i + 1}-q5`,
          testId: `l1-t${i + 1}`,
          code: `int x = 5;\nint y = ++x;\nint z = --y;\nprintf("%d %d", x, z);`,
          options: [
            { id: 'A', text: '6 5' },
            { id: 'B', text: '6 6' },
            { id: 'C', text: '5 5' },
            { id: 'D', text: '5 6' }
          ],
          correctAnswer: 'A',
          explanation: 'x=6, y=6. z=--y=5. Result: 6 5.',
          category: 'Sequence'
        }
      ]
    }))
  },
  {
    id: 'level-2',
    name: 'LEVEL 2 — Arrays + Index Mutation',
    description: 'Array indexing with side-effects.',
    theory: 'Mutating an index while accessing the array can lead to UB if not separated by sequence points.',
    tricks: ['If index is modified in same expr: Beware UB.', 'Check order of evaluation.'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `l2-t${i + 1}`,
      levelId: 'level-2',
      name: `Test ${i + 1}: Indexing Hazards`,
      questions: [
        {
          id: `l2-t${i + 1}-q1`,
          testId: `l2-t${i + 1}`,
          code: `int a[] = {10, 20, 30};\nint i = 0;\nint x = a[i++];\nprintf("%d %d", i, x);`,
          options: [
            { id: 'A', text: '1 10' },
            { id: 'B', text: '1 20' },
            { id: 'C', text: '0 10' },
            { id: 'D', text: 'UB' }
          ],
          correctAnswer: 'A',
          explanation: 'Semicolon ensures i is 1 after this line.',
          category: 'Array'
        },
        {
          id: `l2-t${i + 1}-q2`,
          testId: `l2-t${i + 1}`,
          code: `int a[] = {1, 2, 3};\nint i = 0;\nint x = a[i] + i++;`,
          options: [
            { id: 'A', text: '1' },
            { id: 'B', text: '2' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'C',
          explanation: 'Accessing i and modifying i in the same expression without sequence points.',
          category: 'UB'
        },
        {
          id: `l2-t${i + 1}-q3`,
          testId: `l2-t${i + 1}`,
          code: `int a[] = {1, 2, 3};\nint i = 1;\nint x = a[--i];\nprintf("%d %d", i, x);`,
          options: [
            { id: 'A', text: '0 1' },
            { id: 'B', text: '0 2' },
            { id: 'C', text: '1 1' },
            { id: 'D', text: 'UB' }
          ],
          correctAnswer: 'A',
          explanation: 'Prefix decrement happens before indexing.',
          category: 'Array'
        },
        {
          id: `l2-t${i + 1}-q4`,
          testId: `l2-t${i + 1}`,
          code: `int a[] = {5, 6, 7};\nint i = 0;\na[i++] = 10;\nprintf("%d", a[0]);`,
          options: [
            { id: 'A', text: '5' },
            { id: 'B', text: '10' },
            { id: 'C', text: '6' },
            { id: 'D', text: 'UB' }
          ],
          correctAnswer: 'B',
          explanation: 'i is 0 at point of access, then increments.',
          category: 'Array Assignment'
        },
        {
          id: `l2-t${i + 1}-q5`,
          testId: `l2-t${i + 1}`,
          code: `int a[] = {1, 2};\nint i = 0;\nint x = (i++, a[i]);`,
          options: [
            { id: 'A', text: '1' },
            { id: 'B', text: '2' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'B',
          explanation: 'Comma operator IS a sequence point. i becomes 1, then a[1] is read.',
          category: 'Comma Sequence'
        }
      ]
    }))
  },
  {
    id: 'level-3',
    name: 'LEVEL 3 — Undefined Behavior Detection',
    description: 'The illegal operations that crash common sense.',
    theory: 'Modifying a scalar twice between sequence points is Undefined Behavior.',
    tricks: ['x = x++: Classic UB.', '++x + ++x: Classic UB.'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `l3-t${i + 1}`,
      levelId: 'level-3',
      name: `Test ${i + 1}: UB Radar`,
      questions: [
        {
          id: `l3-t${i + 1}-q1`,
          testId: `l3-t${i + 1}`,
          code: `int x = 5;\nx = x++;`,
          options: [
            { id: 'A', text: '5' },
            { id: 'B', text: '6' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'C',
          explanation: 'Assignment and increment on same variable without sequence point.',
          category: 'UB'
        },
        {
          id: `l3-t${i + 1}-q2`,
          testId: `l3-t${i + 1}`,
          code: `int x = 2;\nint y = ++x + ++x;`,
          options: [
            { id: 'A', text: '6' },
            { id: 'B', text: '7' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '8' }
          ],
          correctAnswer: 'C',
          explanation: 'Multiple prefix increments.',
          category: 'UB'
        },
        {
          id: `l3-t${i + 1}-q3`,
          testId: `l3-t${i + 1}`,
          code: `int x = 1;\nint y = ++x;\nprintf("%d", ++y);`,
          options: [
            { id: 'A', text: '2' },
            { id: 'B', text: '3' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '1' }
          ],
          correctAnswer: 'B',
          explanation: 'This is fine because y is modified on separate lines/expressions.',
          category: 'Safe'
        },
        {
          id: `l3-t${i + 1}-q4`,
          testId: `l3-t${i + 1}`,
          code: `int x = 10;\nprintf("%d %d", x++, ++x);`,
          options: [
            { id: 'A', text: '10 12' },
            { id: 'B', text: '11 11' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '12 12' }
          ],
          correctAnswer: 'C',
          explanation: 'Order of arguments in printf is unspecified, and they modify the same variable.',
          category: 'UB'
        },
        {
          id: `l3-t${i + 1}-q5`,
          testId: `l3-t${i + 1}`,
          code: `int x = 0;\nx = ++x + 1;`,
          options: [
            { id: 'A', text: '1' },
            { id: 'B', text: '2' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'B',
          explanation: 'Actually C++11 makes this defined, but in strict C89/90/99 it was often interpreted as UB or unspecified. Most tests consider this UB due to assignment overlap.',
          category: 'UB'
        }
      ]
    }))
  },
  {
    id: 'level-tricky',
    name: 'TRICKY LEVEL — Mixed Illusions',
    description: 'Where operator precedence meets logic traps.',
    theory: 'Precedence is not order of evaluation. Just because a has higher precedence doesn\'t mean its side effect happens first.',
    tricks: ['() don\'t force timing.', 'Watch for overlapping variables.'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `ltr-t${i + 1}`,
      levelId: 'level-tricky',
      name: `Test ${i + 1}: Precedence Pits`,
      questions: [
        {
          id: `ltr-t${i + 1}-q1`,
          testId: `ltr-t${i + 1}`,
          code: `int x = 1;\nint y = x++ * ++x;`,
          options: [
            { id: 'A', text: '2' },
            { id: 'B', text: '4' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '3' }
          ],
          correctAnswer: 'C',
          explanation: 'Multiple mods in multiplication.',
          category: 'UB'
        },
        {
          id: `ltr-t${i + 1}-q2`,
          testId: `ltr-t${i + 1}`,
          code: `int x = 2;\nint y = ++x && ++x;`,
          options: [
            { id: 'A', text: 'UB' },
            { id: 'B', text: '1' },
            { id: 'C', text: 'x=4, y=1' },
            { id: 'D', text: 'x=3, y=1' }
          ],
          correctAnswer: 'C',
          explanation: 'Logical AND (&&) IS a sequence point. Left side happens first.',
          category: 'Logical Sequence'
        },
        {
          id: `ltr-t${i + 1}-q3`,
          testId: `ltr-t${i + 1}`,
          code: `int x = 0;\nint y = x++ || ++x;`,
          options: [
            { id: 'A', text: 'UB' },
            { id: 'B', text: 'x=1, y=1' },
            { id: 'C', text: 'x=2, y=1' },
            { id: 'D', text: 'x=1, y=0' }
          ],
          correctAnswer: 'C',
          explanation: 'x++ is 0 (False), so right side MUST execute. x becomes 1, then ++x makes it 2. Logical OR is a sequence point.',
          category: 'Logical Short-circuit'
        },
        {
          id: `ltr-t${i + 1}-q4`,
          testId: `ltr-t${i + 1}`,
          code: `int x = 1;\nint y = !!x++;`,
          options: [
            { id: 'A', text: '1' },
            { id: 'B', text: '0' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: 'x' }
          ],
          correctAnswer: 'A',
          explanation: 'x++ returns 1. !1 is 0. !0 is 1. x becomes 2.',
          category: 'Unary'
        },
        {
          id: `ltr-t${i + 1}-q5`,
          testId: `ltr-t${i + 1}`,
          code: `int x = 5;\nint y = (x++, x++, x++);\nprintf("%d", y);`,
          options: [
            { id: 'A', text: '5' },
            { id: 'B', text: '6' },
            { id: 'C', text: '7' },
            { id: 'D', text: '8' }
          ],
          correctAnswer: 'C',
          explanation: 'Comma operator returns the LAST expression value AFTER the side effect of previous ones. 5 -> 6 -> 7.',
          category: 'Comma'
        }
      ]
    }))
  },
  {
    id: 'level-master',
    name: 'MASTER LEVEL — Multi-variable Interaction',
    description: 'Complicated cross-variable mutations.',
    theory: 'Interactions between different variables are fine, but look for hidden dependencies.',
    tricks: ['Track every variable separately.', 'Check for implicit pointers/aliasing.'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `lms-t${i + 1}`,
      levelId: 'level-master',
      name: `Test ${i + 1}: Multi-Var Maze`,
      questions: [
        {
          id: `lms-t${i + 1}-q1`,
          testId: `lms-t${i + 1}`,
          code: `int a=1, b=1;\nint x = ++a + b++;\nprintf("%d %d %d", a, b, x);`,
          options: [
            { id: 'A', text: '2 2 3' },
            { id: 'B', text: '1 2 2' },
            { id: 'C', text: '2 1 3' },
            { id: 'D', text: 'UB' }
          ],
          correctAnswer: 'A',
          explanation: 'Safe since a and b are distinct objects.',
          category: 'Multi-Var'
        },
        {
          id: `lms-t${i + 1}-q2`,
          testId: `lms-t${i + 1}`,
          code: `int a=5, b=2;\nint x = a-- - --b;\nprintf("%d", x);`,
          options: [
            { id: 'A', text: '4' },
            { id: 'B', text: '3' },
            { id: 'C', text: '5' },
            { id: 'D', text: '2' }
          ],
          correctAnswer: 'A',
          explanation: '5 - 1 = 4.',
          category: 'Arithmetic'
        },
        {
          id: `lms-t${i + 1}-q3`,
          testId: `lms-t${i + 1}`,
          code: `int x=2;\nint *p = &x;\nint y = x++ + (*p)++;`,
          options: [
            { id: 'A', text: '4' },
            { id: 'B', text: '5' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '6' }
          ],
          correctAnswer: 'C',
          explanation: 'Aliasing! x and *p refer to same memory. Mutating twice = UB.',
          category: 'Pointers'
        },
        {
          id: `lms-t${i + 1}-q4`,
          testId: `lms-t${i + 1}`,
          code: `int a=1, b=2, c=3;\nint x = a++ + (b++ * c++);`,
          options: [
            { id: 'A', text: '7' },
            { id: 'B', text: '8' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '9' }
          ],
          correctAnswer: 'A',
          explanation: '1 + (2 * 3) = 7. All distinct variables.',
          category: 'Distinct'
        },
        {
          id: `lms-t${i + 1}-q5`,
          testId: `lms-t${i + 1}`,
          code: `int x=1;\nint y = (x=5, ++x);`,
          options: [
            { id: 'A', text: '5' },
            { id: 'B', text: '6' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '1' }
          ],
          correctAnswer: 'B',
          explanation: 'Comma ensures x=5 is complete, then ++x is fine.',
          category: 'Sequence'
        }
      ]
    }))
  },
  {
    id: 'level-god',
    name: 'GOD LEVEL — Full System Stress Test',
    description: 'The ultimate survival course.',
    theory: 'Deep pointer arithmetic and multi-layered mutations.',
    tricks: ['Check pointer types.', 'Sequence points in ternary/logical ops.'],
    tests: Array.from({ length: 5 }, (_, i) => ({
      id: `lgd-t${i + 1}`,
      levelId: 'level-god',
      name: `Test ${i + 1}: Final Boss`,
      questions: [
        {
          id: `lgd-t${i + 1}-q1`,
          testId: `lgd-t${i + 1}`,
          code: `int a[]={10,20,30};\nint *p=a;\nint x = *p++ + *p++;`,
          options: [
            { id: 'A', text: '30' },
            { id: 'B', text: '40' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '50' }
          ],
          correctAnswer: 'C',
          explanation: 'Modifying p twice in one expr.',
          category: 'Pointer UB'
        },
        {
          id: `lgd-t${i + 1}-q2`,
          testId: `lgd-t${i + 1}`,
          code: `int x=1;\nint y = x ? x++ : ++x;`,
          options: [
            { id: 'A', text: '1' },
            { id: 'B', text: '2' },
            { id: 'C', text: 'UB' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'A',
          explanation: 'Ternary (?) is a sequence point. Only one branch executes.',
          category: 'Ternary'
        },
        {
          id: `lgd-t${i + 1}-q3`,
          testId: `lgd-t${i + 1}`,
          code: `int x=0;\nint y = ++x && (x=5);`,
          options: [
            { id: 'A', text: 'x=5, y=1' },
            { id: 'B', text: 'UB' },
            { id: 'C', text: 'x=1, y=0' },
            { id: 'D', text: 'x=6, y=1' }
          ],
          correctAnswer: 'A',
          explanation: '&& is sequence point. x=1, then x=5.',
          category: 'Logical Seq'
        },
        {
          id: `lgd-t${i + 1}-q4`,
          testId: `lgd-t${i + 1}`,
          code: `int a=1;\nint b = (a++, a) + a++;`,
          options: [
            { id: 'A', text: 'UB' },
            { id: 'B', text: '4' },
            { id: 'C', text: '5' },
            { id: 'D', text: '3' }
          ],
          correctAnswer: 'A',
          explanation: 'Comma protects first mod, but second + doesn\'t have sequence point vs first part.',
          category: 'UB'
        },
        {
          id: `lgd-t${i + 1}-q5`,
          testId: `lgd-t${i + 1}`,
          code: `int a[]={1,2,3};\nint i=1;\nint x = a[i] = i++;`,
          options: [
            { id: 'A', text: 'UB' },
            { id: 'B', text: '1' },
            { id: 'C', text: '2' },
            { id: 'D', text: '0' }
          ],
          correctAnswer: 'A',
          explanation: 'Assignment side effect and index side effect on same line.',
          category: 'UB'
        }
      ]
    }))
  }
];
