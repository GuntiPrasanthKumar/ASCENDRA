export const mockLessons = [

  // ════════════════════════════════════════════════════════════
  // CHAPTER: dynamic-programming
  // ════════════════════════════════════════════════════════════
  {
    id: 'dp-introduction',
    chapterId: 'dynamic-programming',
    title: 'Introduction to Dynamic Programming',
    estimatedMinutes: 10,
    pointsAwarded: 50,
    contentBlocks: [
      { id: 'b1', type: 'heading', value: 'The Paradigm of Overlapping Subproblems' },
      { id: 'b2', type: 'paragraph', value: 'Dynamic Programming (DP) is both a mathematical optimization method and a computer programming technique. It solves complex problems by breaking them into simpler overlapping subproblems and storing the results to avoid redundant computation.' },
      { id: 'b3', type: 'info_card', value: 'Key Insight: Whenever you see a recursive solution that calls itself with the same arguments, DP can optimize it from exponential to polynomial time.' },
      { id: 'b4', type: 'heading', value: 'Two Classic Properties' },
      { id: 'b5', type: 'list', value: ['Optimal Substructure: The optimal solution of the whole problem depends on optimal solutions of subproblems.', 'Overlapping Subproblems: The same subproblems are solved multiple times during recursion.'] },
      { id: 'b6', type: 'heading', value: 'Naive Fibonacci — The Classic Anti-Pattern' },
      { id: 'b7', type: 'code_block', language: 'javascript', value: `// ❌ Naive recursion — O(2^n) time complexity
function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// fib(5) computes fib(3) twice, fib(2) three times!
console.log(fibNaive(40)); // Takes seconds due to 2^40 calls` },
      { id: 'b8', type: 'important_note', value: 'fibNaive(40) makes over 330 million function calls. DP reduces this to exactly 40 operations by caching subresults.' },
      { id: 'b9', type: 'summary', value: 'Dynamic Programming is an optimization technique that turns exponential-time recursive solutions into polynomial-time solutions by storing intermediate results.' },
      { id: 'b10', type: 'key_takeaway', value: 'Ask yourself: Are there overlapping subproblems? Is there optimal substructure? If YES to both — DP is your tool.' }
    ]
  },

  {
    id: 'memoization-basics',
    chapterId: 'dynamic-programming',
    title: 'Memoization (Top-Down DP)',
    estimatedMinutes: 12,
    pointsAwarded: 60,
    contentBlocks: [
      { id: 'm1', type: 'heading', value: 'Top-Down Recursive Caching' },
      { id: 'm2', type: 'paragraph', value: 'Memoization is the Top-Down DP approach. You keep the recursive structure of your solution, but add a cache (Map or object) to store results of subproblems. Before computing, check the cache first.' },
      { id: 'm3', type: 'code_block', language: 'javascript', value: `// ✅ Memoized Fibonacci — O(n) time, O(n) space
const cache = new Map();

function memoFib(n) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n); // Cache hit!
  
  const result = memoFib(n - 1) + memoFib(n - 2);
  cache.set(n, result); // Store before returning
  return result;
}

console.log(memoFib(100)); // Instant — only 100 unique calls` },
      { id: 'm4', type: 'info_card', value: 'The cache Map stores (n → result) pairs. Each unique n is computed exactly once. The call tree is "pruned" at cached nodes.' },
      { id: 'm5', type: 'heading', value: 'When to Use Memoization' },
      { id: 'm6', type: 'list', value: ['When the recursive structure is already clear and natural to reason about', 'When only a sparse subset of all states are actually visited', 'When the call graph is irregular (e.g., game tree search, alpha-beta pruning)'] },
      { id: 'm7', type: 'important_note', value: 'Memoization uses the call stack. For very large n, you may hit stack overflow. Tabulation (Bottom-Up) avoids this.' },
      { id: 'm8', type: 'key_takeaway', value: 'Memoization = Recursion + Cache. Start with the recursive solution you understand, then add a Map to cache return values.' }
    ]
  },

  {
    id: 'tabulation-approach',
    chapterId: 'dynamic-programming',
    title: 'Tabulation (Bottom-Up DP)',
    estimatedMinutes: 14,
    pointsAwarded: 65,
    contentBlocks: [
      { id: 't1', type: 'heading', value: 'Building Solutions Iteratively' },
      { id: 't2', type: 'paragraph', value: 'Tabulation is the Bottom-Up DP approach. Instead of recursing from the top and caching results, you fill a table starting from the smallest subproblems and build up to the answer.' },
      { id: 't3', type: 'code_block', language: 'javascript', value: `// ✅ Tabulation Fibonacci — O(n) time, O(n) space
function tabFib(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // Fill table forward
  }
  return dp[n];
}

// ✅✅ Space-optimized — O(1) space!
function optFib(n) {
  let [prev, curr] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}` },
      { id: 't4', type: 'info_card', value: 'Space Optimization Trick: If dp[i] only depends on dp[i-1] and dp[i-2], you only need 2 variables — no full array needed!' },
      { id: 't5', type: 'heading', value: 'Memoization vs Tabulation' },
      { id: 't6', type: 'list', value: ['Memoization: Recursive, lazy (only computes needed states), risk of stack overflow', 'Tabulation: Iterative, eager (fills all states), no stack overflow, easier to optimize space', 'Rule of thumb: Start with memoization for clarity, refactor to tabulation for performance'] },
      { id: 't7', type: 'key_takeaway', value: 'Tabulation avoids recursion overhead and stack limits. Always try to find the space optimization after solving the DP.' }
    ]
  },

  {
    id: 'dp-on-grids',
    chapterId: 'dynamic-programming',
    title: 'DP on Grids — 2D Problems',
    estimatedMinutes: 16,
    pointsAwarded: 75,
    contentBlocks: [
      { id: 'g1', type: 'heading', value: 'Grid-Based Dynamic Programming' },
      { id: 'g2', type: 'paragraph', value: 'Many DP problems involve a 2D grid where you move from cell to cell under constraints. The key is defining the state: dp[i][j] typically represents the answer for the subgrid ending at row i, column j.' },
      { id: 'g3', type: 'heading', value: 'Classic Problem: Minimum Path Sum' },
      { id: 'g4', type: 'paragraph', value: 'Given an m×n grid of non-negative integers, find a path from top-left to bottom-right that minimizes the sum of all numbers along the path. You can only move right or down.' },
      { id: 'g5', type: 'code_block', language: 'javascript', value: `function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  const dp = Array.from({length: m}, (_, i) =>
    Array.from({length: n}, (_, j) => grid[i][j])
  );
  
  // Fill first row (can only come from left)
  for (let j = 1; j < n; j++) dp[0][j] += dp[0][j-1];
  
  // Fill first column (can only come from above)
  for (let i = 1; i < m; i++) dp[i][0] += dp[i-1][0];
  
  // Fill rest: choose min of coming from top or left
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] += Math.min(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m-1][n-1];
}` },
      { id: 'g6', type: 'important_note', value: 'State Transition: dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]). Always define your state and transition before coding.' },
      { id: 'g7', type: 'key_takeaway', value: 'For 2D DP: define state clearly, handle base cases (first row/column), then fill the rest with your transition formula.' }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: heap-operations
  // ════════════════════════════════════════════════════════════
  {
    id: 'heap-introduction',
    chapterId: 'heap-operations',
    title: 'Introduction to Heaps',
    estimatedMinutes: 10,
    pointsAwarded: 50,
    contentBlocks: [
      { id: 'h1', type: 'heading', value: 'What is a Heap?' },
      { id: 'h2', type: 'paragraph', value: 'A Heap is a complete binary tree stored as an array where each parent node satisfies the heap property. In a Min-Heap, every parent is smaller than its children. In a Max-Heap, every parent is larger.' },
      { id: 'h3', type: 'info_card', value: 'Array Representation: For a node at index i, its left child is at 2i+1, right child at 2i+2, and its parent at ⌊(i-1)/2⌋.' },
      { id: 'h4', type: 'code_block', language: 'javascript', value: `class MinHeap {
  constructor() { this.heap = []; }
  
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i)   { return 2 * i + 1; }
  right(i)  { return 2 * i + 2; }
  
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  
  peek() { return this.heap[0]; } // O(1) — min element always at root
}` },
      { id: 'h5', type: 'key_takeaway', value: 'Heaps give you O(1) access to the min/max element and O(log n) insert/delete — the perfect structure for priority queues.' }
    ]
  },

  {
    id: 'priority-queue-ops',
    chapterId: 'heap-operations',
    title: 'Heap Insert & Delete (O log n)',
    estimatedMinutes: 14,
    pointsAwarded: 65,
    contentBlocks: [
      { id: 'pq1', type: 'heading', value: 'Insert: Sift Up' },
      { id: 'pq2', type: 'paragraph', value: 'When inserting into a heap, add the new element at the end of the array (maintaining completeness), then "sift up" by swapping with the parent until the heap property is restored.' },
      { id: 'pq3', type: 'code_block', language: 'javascript', value: `insert(val) {
  this.heap.push(val);
  this.siftUp(this.heap.length - 1);
}

siftUp(i) {
  while (i > 0) {
    const p = this.parent(i);
    if (this.heap[p] > this.heap[i]) {
      this.swap(p, i);
      i = p;
    } else break;
  }
}` },
      { id: 'pq4', type: 'heading', value: 'Extract Min: Sift Down' },
      { id: 'pq5', type: 'code_block', language: 'javascript', value: `extractMin() {
  if (this.heap.length === 0) return null;
  const min = this.heap[0];
  this.heap[0] = this.heap.pop(); // Move last to root
  this.siftDown(0);
  return min;
}

siftDown(i) {
  const n = this.heap.length;
  while (true) {
    let smallest = i;
    const l = this.left(i), r = this.right(i);
    if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
    if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
    if (smallest !== i) { this.swap(i, smallest); i = smallest; }
    else break;
  }
}` },
      { id: 'pq6', type: 'key_takeaway', value: 'Insert sifts UP from the bottom. ExtractMin sifts DOWN from the root. Both are O(log n) since heap height = log n.' }
    ]
  },

  {
    id: 'heap-sort-algorithm',
    chapterId: 'heap-operations',
    title: 'Heap Sort Algorithm',
    estimatedMinutes: 12,
    pointsAwarded: 60,
    contentBlocks: [
      { id: 'hs1', type: 'heading', value: 'Heap Sort: O(n log n) In-Place Sort' },
      { id: 'hs2', type: 'paragraph', value: 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap. Phase 1: Build a max-heap from the array. Phase 2: Repeatedly extract the max (root) and place it at the end.' },
      { id: 'hs3', type: 'code_block', language: 'javascript', value: `function heapSort(arr) {
  const n = arr.length;
  
  // Phase 1: Build max-heap (heapify from last non-leaf)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Phase 2: Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // Move current max to end
    heapify(arr, i, 0); // Re-heapify the reduced heap
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i, l = 2*i+1, r = 2*i+2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}` },
      { id: 'hs4', type: 'important_note', value: 'Heap Sort is O(n log n) worst case (unlike Quicksort which degrades to O(n²)) but has poor cache performance. In practice, Quicksort is faster due to cache locality.' },
      { id: 'hs5', type: 'key_takeaway', value: 'Use Heap Sort when you need guaranteed O(n log n) and O(1) extra space. Use Priority Queue when you need frequent min/max access in a dynamic set.' }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: graph-algorithms
  // ════════════════════════════════════════════════════════════
  {
    id: 'bfs-dfs-basics',
    chapterId: 'graph-algorithms',
    title: 'BFS & DFS — Graph Traversal',
    estimatedMinutes: 15,
    pointsAwarded: 70,
    contentBlocks: [
      { id: 'gv1', type: 'heading', value: 'Graph Representation First' },
      { id: 'gv2', type: 'paragraph', value: 'Graphs are represented as adjacency lists (Map of node → [neighbors]) for sparse graphs, or adjacency matrices for dense graphs. We\'ll use adjacency lists for most problems.' },
      { id: 'gv3', type: 'heading', value: 'Breadth-First Search (BFS)' },
      { id: 'gv4', type: 'paragraph', value: 'BFS explores nodes level by level using a queue. It finds shortest paths in unweighted graphs. Time: O(V + E). Space: O(V).' },
      { id: 'gv5', type: 'code_block', language: 'javascript', value: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}` },
      { id: 'gv6', type: 'heading', value: 'Depth-First Search (DFS)' },
      { id: 'gv7', type: 'code_block', language: 'javascript', value: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  
  for (const neighbor of (graph[start] || [])) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}` },
      { id: 'gv8', type: 'list', value: ['BFS → Shortest path (unweighted), level-order traversal, detect bipartite', 'DFS → Cycle detection, topological sort, connected components, maze solving', 'Both → O(V + E) time with adjacency list'] },
      { id: 'gv9', type: 'key_takeaway', value: 'BFS = Queue = Level by Level. DFS = Stack (or recursion) = Depth First. BFS for shortest paths, DFS for backtracking problems.' }
    ]
  },

  {
    id: 'dijkstra-algorithm',
    chapterId: 'graph-algorithms',
    title: "Dijkstra's Shortest Path Algorithm",
    estimatedMinutes: 18,
    pointsAwarded: 80,
    contentBlocks: [
      { id: 'd1', type: 'heading', value: "Dijkstra's Algorithm — Weighted Shortest Paths" },
      { id: 'd2', type: 'paragraph', value: "Dijkstra's finds the shortest path from a source node to all other nodes in a graph with non-negative edge weights. It uses a greedy approach with a min-priority queue." },
      { id: 'd3', type: 'important_note', value: "Dijkstra's FAILS with negative edge weights. Use Bellman-Ford for graphs with negative edges." },
      { id: 'd4', type: 'code_block', language: 'javascript', value: `function dijkstra(graph, source) {
  // graph: Map<node, Array<{node, weight}>>
  const dist = new Map();
  const visited = new Set();
  
  // Initialize all distances to Infinity
  for (const node of graph.keys()) dist.set(node, Infinity);
  dist.set(source, 0);
  
  // Min-heap: [distance, node]
  const pq = [[0, source]];
  
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // Simulate min-heap
    const [currDist, node] = pq.shift();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    for (const { node: neighbor, weight } of (graph.get(node) || [])) {
      const newDist = currDist + weight;
      if (newDist < dist.get(neighbor)) {
        dist.set(neighbor, newDist);
        pq.push([newDist, neighbor]);
      }
    }
  }
  return dist;
}` },
      { id: 'd5', type: 'info_card', value: 'Time Complexity: O((V + E) log V) with a proper binary heap priority queue. The sort() simulation above is O(V²) — use a real heap in interviews.' },
      { id: 'd6', type: 'key_takeaway', value: "Dijkstra = BFS + Weights. Always relax edges greedily from the closest unvisited node. Use it for GPS navigation, network routing, and game AI." }
    ]
  },

  {
    id: 'topological-sort',
    chapterId: 'graph-algorithms',
    title: 'Topological Sorting',
    estimatedMinutes: 13,
    pointsAwarded: 65,
    contentBlocks: [
      { id: 'ts1', type: 'heading', value: 'What is Topological Order?' },
      { id: 'ts2', type: 'paragraph', value: 'Topological sort orders nodes in a Directed Acyclic Graph (DAG) such that for every edge u→v, node u appears before v. Think of it as scheduling tasks with dependencies.' },
      { id: 'ts3', type: 'info_card', value: 'Only possible on DAGs (Directed Acyclic Graphs). If a cycle exists, no topological order is possible — the algorithm detects this.' },
      { id: 'ts4', type: 'heading', value: "Kahn's Algorithm (BFS-based)" },
      { id: 'ts5', type: 'code_block', language: 'javascript', value: `function topoSort(numNodes, edges) {
  // Build adjacency list + in-degree count
  const adj = Array.from({length: numNodes}, () => []);
  const inDegree = new Array(numNodes).fill(0);
  
  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }
  
  // Start with all nodes that have no dependencies
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of adj[node]) {
      if (--inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  
  // If result has all nodes → valid topo order. Else → cycle!
  return result.length === numNodes ? result : [];
}` },
      { id: 'ts6', type: 'key_takeaway', value: "Topological sort is essential for: task schedulers, build systems (Webpack, Make), course prerequisite ordering, and dependency resolution (npm)." }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: linear-structures (Data Structures)
  // ════════════════════════════════════════════════════════════
  {
    id: 'arrays-overview',
    chapterId: 'linear-structures',
    title: 'Arrays — The Foundation',
    estimatedMinutes: 8,
    pointsAwarded: 40,
    contentBlocks: [
      { id: 'ar1', type: 'heading', value: 'Arrays: Contiguous Memory Blocks' },
      { id: 'ar2', type: 'paragraph', value: 'An array stores elements in contiguous memory locations, allowing O(1) random access by index. This is their superpower — and their limitation defines when to use other structures.' },
      { id: 'ar3', type: 'list', value: ['Access by index: O(1)', 'Search (unsorted): O(n)', 'Insertion at end: O(1) amortized', 'Insertion at middle: O(n) due to shift', 'Deletion at middle: O(n) due to shift'] },
      { id: 'ar4', type: 'code_block', language: 'javascript', value: `// Two Pointer Technique — Most common array pattern
function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    sum < target ? left++ : right--;
  }
  return [-1, -1];
}

// Sliding Window — For subarray problems
function maxSumSubarray(arr, k) {
  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    max = Math.max(max, sum);
  }
  return max;
}` },
      { id: 'ar5', type: 'key_takeaway', value: 'Two Pointers and Sliding Window are the bread and butter of array problems. Master these two patterns and you\'ll solve 80% of array interview questions.' }
    ]
  },

  {
    id: 'linked-list-basics',
    chapterId: 'linear-structures',
    title: 'Linked Lists — Dynamic Chains',
    estimatedMinutes: 12,
    pointsAwarded: 55,
    contentBlocks: [
      { id: 'll1', type: 'heading', value: 'Node-Based Dynamic Structure' },
      { id: 'll2', type: 'paragraph', value: 'A Linked List stores elements as nodes where each node holds a value and a pointer to the next node. Unlike arrays, elements are NOT in contiguous memory — allowing efficient O(1) insertions and deletions at any known position.' },
      { id: 'll3', type: 'code_block', language: 'javascript', value: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Classic: Reverse a Linked List (Iterative)
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next; // Save next
    curr.next = prev;       // Reverse pointer
    prev = curr;            // Move prev forward
    curr = next;            // Move curr forward
  }
  return prev; // New head
}

// Floyd's Cycle Detection
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}` },
      { id: 'll4', type: 'info_card', value: "Floyd's Algorithm (Tortoise & Hare): slow pointer moves 1 step, fast pointer 2 steps. If there's a cycle, they MUST meet." },
      { id: 'll5', type: 'key_takeaway', value: 'Linked List tricks: dummy head nodes, fast & slow pointers, reversing in-place. These three patterns cover 90% of linked list interview problems.' }
    ]
  },

  {
    id: 'stacks-and-queues',
    chapterId: 'linear-structures',
    title: 'Stacks & Queues',
    estimatedMinutes: 10,
    pointsAwarded: 50,
    contentBlocks: [
      { id: 'sq1', type: 'heading', value: 'Stack: Last In, First Out (LIFO)' },
      { id: 'sq2', type: 'paragraph', value: 'A Stack follows LIFO order. Push adds to top, Pop removes from top. Both operations are O(1). Classic applications: function call stacks, undo/redo, bracket matching, DFS.' },
      { id: 'sq3', type: 'code_block', language: 'javascript', value: `// Monotonic Stack — Pattern for "Next Greater Element"
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // Stores indices
  
  for (let i = 0; i < nums.length; i++) {
    // Pop all elements smaller than current
    while (stack.length && nums[stack[stack.length-1]] < nums[i]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}` },
      { id: 'sq4', type: 'heading', value: 'Queue: First In, First Out (FIFO)' },
      { id: 'sq5', type: 'paragraph', value: 'A Queue follows FIFO order. Enqueue adds to the back, Dequeue removes from the front. Use for BFS, task scheduling, and streaming data processing.' },
      { id: 'sq6', type: 'info_card', value: 'Monotonic Stack is one of the most powerful patterns: used for "next greater/smaller element", "largest rectangle in histogram", and "trapping rain water".' },
      { id: 'sq7', type: 'key_takeaway', value: 'Stack = LIFO = DFS/Backtracking/Parsing. Queue = FIFO = BFS/Scheduling. Deque (double-ended) handles both and is used for sliding window maximum.' }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: sql-fundamentals (DBMS)
  // ════════════════════════════════════════════════════════════
  {
    id: 'sql-basics',
    chapterId: 'sql-fundamentals',
    title: 'SQL Fundamentals',
    estimatedMinutes: 12,
    pointsAwarded: 55,
    contentBlocks: [
      { id: 'sql1', type: 'heading', value: 'Structured Query Language — The Universal Database Language' },
      { id: 'sql2', type: 'paragraph', value: 'SQL is a declarative language used to create, read, update, and delete data in relational databases. It has 4 main sub-languages: DDL (structure), DML (data), DQL (query), and DCL (permissions).' },
      { id: 'sql3', type: 'list', value: ['DDL: CREATE TABLE, ALTER TABLE, DROP TABLE', 'DML: INSERT, UPDATE, DELETE', 'DQL: SELECT, WHERE, GROUP BY, ORDER BY, HAVING', 'DCL: GRANT, REVOKE'] },
      { id: 'sql4', type: 'code_block', language: 'sql', value: `-- Create a Students table
CREATE TABLE students (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE,
  gpa        DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query with filtering and sorting
SELECT name, gpa
FROM students
WHERE gpa >= 3.5
ORDER BY gpa DESC
LIMIT 10;

-- Aggregate: Average GPA per department
SELECT department, AVG(gpa) as avg_gpa, COUNT(*) as student_count
FROM students
GROUP BY department
HAVING COUNT(*) > 5;` },
      { id: 'sql5', type: 'key_takeaway', value: 'The SQL execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. HAVING filters after aggregation; WHERE filters before.' }
    ]
  },

  {
    id: 'joins-explained',
    chapterId: 'sql-fundamentals',
    title: 'SQL JOINs Demystified',
    estimatedMinutes: 14,
    pointsAwarded: 65,
    contentBlocks: [
      { id: 'j1', type: 'heading', value: 'Combining Tables with JOINs' },
      { id: 'j2', type: 'paragraph', value: 'JOINs combine rows from two or more tables based on a related column. Understanding JOINs is essential for any SQL interview.' },
      { id: 'j3', type: 'list', value: ['INNER JOIN: Returns rows where the condition matches in BOTH tables', 'LEFT JOIN: All rows from left table + matching rows from right (NULLs for no match)', 'RIGHT JOIN: All rows from right table + matching rows from left (NULLs for no match)', 'FULL OUTER JOIN: All rows from both tables (NULLs where no match)', 'CROSS JOIN: Cartesian product — every row from left × every row from right'] },
      { id: 'j4', type: 'code_block', language: 'sql', value: `-- Find students and their enrolled courses (INNER JOIN)
SELECT s.name, c.title, e.grade
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.id
WHERE e.grade >= 'B';

-- Find students with NO enrollments (LEFT JOIN trick)
SELECT s.name
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
WHERE e.student_id IS NULL; -- NULL means no match found` },
      { id: 'j5', type: 'important_note', value: 'The "Find records with no match" pattern uses LEFT JOIN + WHERE right_table.id IS NULL. This is faster than NOT IN subqueries on large datasets.' },
      { id: 'j6', type: 'key_takeaway', value: 'Memorize: INNER = Intersection, LEFT = All left + matching right, FULL = All from both. The NULL check trick for "anti-joins" is a must-know pattern.' }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: scalability-basics (System Design)
  // ════════════════════════════════════════════════════════════
  {
    id: 'scalability-intro',
    chapterId: 'scalability-basics',
    title: 'Scalability Fundamentals',
    estimatedMinutes: 12,
    pointsAwarded: 60,
    contentBlocks: [
      { id: 'sc1', type: 'heading', value: 'What Does Scalability Mean?' },
      { id: 'sc2', type: 'paragraph', value: 'Scalability is a system\'s ability to handle growing amounts of work by adding resources. A scalable system maintains performance as load increases from 1,000 to 1,000,000 users.' },
      { id: 'sc3', type: 'heading', value: 'Vertical vs Horizontal Scaling' },
      { id: 'sc4', type: 'list', value: ['Vertical Scaling (Scale Up): Add more CPU/RAM to a single machine. Simple but has a hard upper limit and single point of failure.', 'Horizontal Scaling (Scale Out): Add more machines to spread the load. Theoretically unlimited, requires load balancing and stateless design.', 'Rule of Thumb: Vertical first (easier), then Horizontal when you hit the wall.'] },
      { id: 'sc5', type: 'info_card', value: 'Stateless Services Scale Easily: If your server holds no session state in memory, any request can go to any server. This is why JWTs are preferred over server-side sessions at scale.' },
      { id: 'sc6', type: 'heading', value: 'Key Metrics to Know' },
      { id: 'sc7', type: 'list', value: ['Latency: Time to complete one request (ms). Target: p99 < 200ms', 'Throughput: Requests per second (RPS) a system can handle', 'Availability: % of time the system is operational. "Five nines" = 99.999% = ~5 min/year downtime', 'Consistency: All nodes see the same data at the same time (vs eventual consistency)'] },
      { id: 'sc8', type: 'key_takeaway', value: 'In interviews: start with requirements (read vs write heavy, consistency needs, scale targets), then design accordingly. Always state your assumptions.' }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: percentages-ratios (Quant Aptitude)
  // ════════════════════════════════════════════════════════════
  {
    id: 'percentages-intro',
    chapterId: 'percentages-ratios',
    title: 'Percentages — Speed Techniques',
    estimatedMinutes: 10,
    pointsAwarded: 45,
    contentBlocks: [
      { id: 'pc1', type: 'heading', value: 'Percentage Fundamentals' },
      { id: 'pc2', type: 'paragraph', value: 'A percentage is a ratio expressed as a fraction of 100. The word "percent" means "per hundred." Mastering percentage calculations mentally is crucial for aptitude tests under time pressure.' },
      { id: 'pc3', type: 'heading', value: 'Speed Calculation Tricks' },
      { id: 'pc4', type: 'list', value: ['x% of y = y% of x (Symmetry trick: 13% of 50 = 50% of 13 = 6.5)', '10% is always easy: just move decimal left by 1 (10% of 340 = 34)', 'Build any % from 10%: 15% = 10% + 5% = 10% + half of 10%', 'Percentage increase formula: ((New - Old) / Old) × 100'] },
      { id: 'pc5', type: 'heading', value: 'Classic Problem Types' },
      { id: 'pc6', type: 'info_card', value: 'Successive Discounts: A 20% discount followed by 10% discount is NOT 30%. It\'s: 1 - (0.8 × 0.9) = 1 - 0.72 = 28% overall discount.' },
      { id: 'pc7', type: 'code_block', language: 'text', value: `Problem: A price increases by 20%, then decreases by 20%. Net change?

Step 1: Start with 100
Step 2: Increase by 20% → 100 × 1.2 = 120
Step 3: Decrease by 20% → 120 × 0.8 = 96
Net Change: (96 - 100) / 100 × 100% = -4%

Key Insight: Always multiply factors, never add/subtract percentages directly.` },
      { id: 'pc8', type: 'key_takeaway', value: 'Never add/subtract percentages. Always multiply the factors. 20% up + 20% down = net -4% (not 0%).' }
    ]
  },

  {
    id: 'ratio-proportion',
    chapterId: 'percentages-ratios',
    title: 'Ratios & Proportions',
    estimatedMinutes: 10,
    pointsAwarded: 45,
    contentBlocks: [
      { id: 'rp1', type: 'heading', value: 'Understanding Ratios' },
      { id: 'rp2', type: 'paragraph', value: 'A ratio compares two quantities of the same kind. A:B = A/B. Ratios must be in simplest form. Proportions state that two ratios are equal: A:B = C:D.' },
      { id: 'rp3', type: 'list', value: ['If A:B = 3:4, then A = 3k and B = 4k for some constant k', 'Cross Multiplication: A/B = C/D → A×D = B×C', 'If ratio is a:b:c, total parts = a+b+c. Each part = Total / (a+b+c)', 'Compound ratio: (a:b) and (c:d) → ac:bd'] },
      { id: 'rp4', type: 'code_block', language: 'text', value: `Problem: Divide ₹1200 among A, B, C in ratio 2:3:5.
Total parts = 2 + 3 + 5 = 10
A's share = (2/10) × 1200 = ₹240
B's share = (3/10) × 1200 = ₹360
C's share = (5/10) × 1200 = ₹600
Check: 240 + 360 + 600 = 1200 ✓` },
      { id: 'rp5', type: 'key_takeaway', value: 'For ratio problems: express each quantity as a multiple of k, set up equation with the given total, solve for k.' }
    ]
  },

  {
    id: 'profit-loss',
    chapterId: 'percentages-ratios',
    title: 'Profit, Loss & Discounts',
    estimatedMinutes: 12,
    pointsAwarded: 55,
    contentBlocks: [
      { id: 'pl1', type: 'heading', value: 'Profit & Loss Formulas' },
      { id: 'pl2', type: 'list', value: ['Profit = Selling Price (SP) - Cost Price (CP)', 'Loss = Cost Price (CP) - Selling Price (SP)', 'Profit % = (Profit / CP) × 100', 'Loss % = (Loss / CP) × 100', 'SP = CP × (1 + Profit%/100)', 'CP = SP / (1 + Profit%/100)'] },
      { id: 'pl3', type: 'info_card', value: 'Key Insight: Profit% and Loss% are ALWAYS calculated on Cost Price (CP), not SP. This is a very common mistake!' },
      { id: 'pl4', type: 'code_block', language: 'text', value: `Trick: If a man sells at x% loss on CP, which equals y% gain on SP:
Relation: (100-x) = (100+y) × (100/(100+y)) → x+y = xy/100

Example: SP = ₹800, Profit = 25%
CP = 800 / 1.25 = ₹640
Profit = 800 - 640 = ₹160 ✓` },
      { id: 'pl5', type: 'key_takeaway', value: 'Always find CP first. Then calculate profit/loss as a percentage of CP. SP can be above or below CP depending on profit or loss.' }
    ]
  },

  // ════════════════════════════════════════════════════════════
  // CHAPTER: processes-threads (OS Concepts)
  // ════════════════════════════════════════════════════════════
  {
    id: 'process-lifecycle',
    chapterId: 'processes-threads',
    title: 'Process Lifecycle & States',
    estimatedMinutes: 12,
    pointsAwarded: 55,
    contentBlocks: [
      { id: 'pr1', type: 'heading', value: 'What is a Process?' },
      { id: 'pr2', type: 'paragraph', value: 'A process is a program in execution. It includes the program code, current activity (program counter), stack, heap, and data section. The OS manages processes via the Process Control Block (PCB).' },
      { id: 'pr3', type: 'list', value: ['New: Process being created', 'Ready: Waiting to be assigned to CPU', 'Running: Instructions being executed', 'Waiting/Blocked: Waiting for I/O or event', 'Terminated: Process has finished execution'] },
      { id: 'pr4', type: 'info_card', value: 'Context Switch: When the OS switches CPU from one process to another. The current state is saved to PCB and the next process\'s state is loaded. This overhead is why too many processes hurt performance.' },
      { id: 'pr5', type: 'heading', value: 'Process vs Thread' },
      { id: 'pr6', type: 'list', value: ['Process: Independent memory space, heavier (MB of overhead), slower context switch', 'Thread: Shares memory within a process, lighter (KB overhead), faster context switch', 'Threads within a process share: heap, code, data segments', 'Threads have their own: stack, registers, program counter'] },
      { id: 'pr7', type: 'key_takeaway', value: 'Threads are lightweight processes that share memory. Use threads for parallelism within a program. Use processes for isolation (e.g., microservices, Chrome tabs).' }
    ]
  }
];
