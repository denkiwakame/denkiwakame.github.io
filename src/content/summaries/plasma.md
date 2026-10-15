---
paper: plasma
tldr: Plasma runs any graph-based ANNS index under one GPU search kernel and shows that vertex reordering alone raises QPS by up to 80% while preserving accuracy.
reviewed: true
---

## Motivation

> Does the memory layout of a graph index, and not only its topology, determine how fast graph-based ANNS runs on GPU?

Graph-based approximate nearest neighbor search (ANNS), a core primitive for RAG, has advanced mainly through graph topology and search algorithms. Yet on GPUs, memory bandwidth and latency bottlenecks are far more prominent than on CPUs. Graph reordering, which permutes vertex IDs and thus memory positions, helps CPU-based ANNS, but its effect on GPU was unexplored. It is also hard to isolate, since each GPU index ships with its own search kernel.

## Approach

Plasma decouples topology from memory layout with three components. A graph adapter converts the topology of any index (e.g., Faiss, DiskANN) to a common GPU format, so CPU-oriented indices also run on GPU. A reordering module applies a permutation $\pi$ to vertex IDs so that vertices co-accessed during traversal occupy consecutive memory (e.g., Hub Sort, GOrder, RCM). A unified engine runs the same GPU-optimized beam-search kernel (from CAGRA) for every condition, so differences reflect only topology or layout.

## Key results

- **Topology alone (four indices, 12 datasets, NVIDIA A100, no reordering):** CPU-oriented NSG and Vamana match or beat GPU-optimized CAGRA on several datasets; on C4 5M, NSG outperforms CAGRA by up to 1.2 times (Sec. 5.2, Fig. 5).
- **Reordering:** up to 80% QPS improvement while preserving search accuracy, with typical gains of 10–30% in positive cases. C4 5M improves by 60–80% for all indices, while BioASQ 1M and 10M gain less than 10% except for NN-Descent (Sec. 5.3).
- **Cause:** reordering changes L2 hit rates by typically less than 1 percentage point (L1 hit rates stay near zero), but the change in DRAM bandwidth utilization correlates with the change in execution time ($-0.669$ overall, $-0.965$ for the search kernel) (Sec. 5.4, Fig. 8).
- **Hardware:** improvements reach 80% on the A100 (HBM2e, 2,039 GB/s) but remain below 15% on an RTX 6000 Ada (GDDR6, 960 GB/s) (Sec. 6.3).

## Conclusion

On GPU, memory layout matters alongside topology. Reordering leaves the index untouched yet raises throughput by up to 80%, and with layout held fixed, CPU-oriented indices compete with GPU-native ones. Because GPU graph search is memory-bandwidth-limited, Plasma gives practitioners working with high-dimensional embeddings a fair, reproducible way to see where their speed comes from.
