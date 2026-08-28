export const mockChapters = [
  // ── Advanced Algorithms ──────────────────────────────────────
  {
    id: 'dynamic-programming',
    subjectId: 'adv-algorithms',
    title: 'Dynamic Programming',
    description: 'Learn memoization, tabulation, and standard DP solver optimization patterns for interview-level problems.',
    order: 1,
    estimatedMinutes: 45,
    lessonIds: ['dp-introduction', 'memoization-basics', 'tabulation-approach', 'dp-on-grids']
  },
  {
    id: 'heap-operations',
    subjectId: 'adv-algorithms',
    title: 'Heap Priorities & Queues',
    description: 'Master binary heaps, priority queues, and heap sort. Understand min-heap vs max-heap trade-offs.',
    order: 2,
    estimatedMinutes: 35,
    lessonIds: ['heap-introduction', 'priority-queue-ops', 'heap-sort-algorithm']
  },
  {
    id: 'graph-algorithms',
    subjectId: 'adv-algorithms',
    title: 'Graph Traversal & Shortest Paths',
    description: 'BFS, DFS, Dijkstra, Bellman-Ford, and topological sorting — the complete graph algorithm toolkit.',
    order: 3,
    estimatedMinutes: 60,
    lessonIds: ['bfs-dfs-basics', 'dijkstra-algorithm', 'topological-sort']
  },

  // ── Data Structures ───────────────────────────────────────────
  {
    id: 'linear-structures',
    subjectId: 'data-structures',
    title: 'Linear Data Structures',
    description: 'Arrays, Linked Lists, Stacks, and Queues — their implementations, complexities, and use cases.',
    order: 1,
    estimatedMinutes: 40,
    lessonIds: ['arrays-overview', 'linked-list-basics', 'stacks-and-queues']
  },
  {
    id: 'tree-structures',
    subjectId: 'data-structures',
    title: 'Trees & Binary Search Trees',
    description: 'Understand tree traversals, BST operations, AVL trees, and segment trees for range queries.',
    order: 2,
    estimatedMinutes: 50,
    lessonIds: ['binary-tree-basics', 'bst-operations', 'tree-traversals', 'avl-trees']
  },
  {
    id: 'hash-maps',
    subjectId: 'data-structures',
    title: 'Hash Maps & Sets',
    description: 'Hash functions, collision resolution, open addressing, and real-world applications of hash tables.',
    order: 3,
    estimatedMinutes: 30,
    lessonIds: ['hashing-fundamentals', 'collision-resolution', 'hashmap-applications']
  },

  // ── System Design ─────────────────────────────────────────────
  {
    id: 'scalability-basics',
    subjectId: 'system-design',
    title: 'Scalability & Load Balancing',
    description: 'Horizontal vs vertical scaling, load balancers, reverse proxies, CDNs, and stateless architecture.',
    order: 1,
    estimatedMinutes: 50,
    lessonIds: ['scalability-intro', 'load-balancers', 'cdn-and-caching']
  },
  {
    id: 'databases-caching',
    subjectId: 'system-design',
    title: 'Databases & Caching Layers',
    description: 'SQL vs NoSQL trade-offs, sharding, replication, Redis caching patterns, and database indexing at scale.',
    order: 2,
    estimatedMinutes: 55,
    lessonIds: ['sql-vs-nosql', 'sharding-replication', 'redis-caching']
  },
  {
    id: 'design-patterns',
    subjectId: 'system-design',
    title: 'API Design & Microservices',
    description: 'REST vs GraphQL, rate limiting, API gateway patterns, and microservices decomposition strategies.',
    order: 3,
    estimatedMinutes: 45,
    lessonIds: ['rest-api-design', 'microservices-patterns']
  },

  // ── Operating Systems ─────────────────────────────────────────
  {
    id: 'processes-threads',
    subjectId: 'os-concepts',
    title: 'Processes & Threads',
    description: 'Process lifecycle, context switching, thread synchronization, semaphores, and deadlock detection.',
    order: 1,
    estimatedMinutes: 50,
    lessonIds: ['process-lifecycle', 'thread-sync', 'deadlocks']
  },
  {
    id: 'memory-management',
    subjectId: 'os-concepts',
    title: 'Memory Management',
    description: 'Virtual memory, paging, segmentation, page replacement algorithms, and thrashing prevention.',
    order: 2,
    estimatedMinutes: 45,
    lessonIds: ['virtual-memory', 'paging-segmentation']
  },

  // ── DBMS ─────────────────────────────────────────────────────
  {
    id: 'sql-fundamentals',
    subjectId: 'dbms',
    title: 'SQL Fundamentals',
    description: 'DDL, DML, DQL, normalization forms, ER diagrams, and relational algebra from the ground up.',
    order: 1,
    estimatedMinutes: 40,
    lessonIds: ['sql-basics', 'normalization', 'joins-explained']
  },
  {
    id: 'advanced-sql',
    subjectId: 'dbms',
    title: 'Advanced SQL & Indexing',
    description: 'Window functions, CTEs, query optimization, execution plans, and B-tree index internals.',
    order: 2,
    estimatedMinutes: 50,
    lessonIds: ['window-functions', 'query-optimization']
  },
  {
    id: 'nosql-concepts',
    subjectId: 'dbms',
    title: 'NoSQL Databases',
    description: 'Document, key-value, columnar, and graph databases. CAP theorem and eventual consistency.',
    order: 3,
    estimatedMinutes: 35,
    lessonIds: ['nosql-overview', 'cap-theorem']
  },

  // ── Quantitative Aptitude ─────────────────────────────────────
  {
    id: 'percentages-ratios',
    subjectId: 'quant-aptitude',
    title: 'Percentages & Ratios',
    description: 'Cover quick ratio computations, percent adjustments, profit-loss, and compound interest formulas.',
    order: 1,
    estimatedMinutes: 30,
    lessonIds: ['percentages-intro', 'ratio-proportion', 'profit-loss']
  },
  {
    id: 'permutations-combinations',
    subjectId: 'quant-aptitude',
    title: 'Permutations & Combinations',
    description: 'Counting principles, nPr, nCr, circular permutations, and probability fundamentals.',
    order: 2,
    estimatedMinutes: 35,
    lessonIds: ['counting-principles', 'ncr-npr', 'probability-basics']
  }
];
