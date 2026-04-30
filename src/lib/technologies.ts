import {
  Cpu,
  Network,
  Shield,
  Database,
  Lock,
  Eye,
  Edit3,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

export interface Technology {
  slug: string;
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  longDescription: string;
  features: string[];
  status: "implemented" | "prototype" | "in-development" | "planned";
  technicalDetails?: string;
}

export const technologies: Technology[] = [
  {
    slug: "kryo-arch",
    title: "Kryo Arch",
    shortDescription: "Serverless, local‑first architecture with infinite control.",
    icon: Cpu,
    longDescription:
      "Kryo Arch is a radical departure from traditional client‑server models. Almost everything is stored locally on your machine. You decide exactly who sees your posts, who is hidden, and how data flows. This architecture makes the network virtually unblockable and puts you in complete ownership of your digital presence.",
    features: [
      "Local‑first data storage",
      "Fine‑grained visibility controls",
      "No central servers to attack or censor",
      "Improved peer-to-peer",
    ],
    status: "prototype",
    technicalDetails:
      "Technical details will be partially available later.",
  },
  {
    slug: "transcendent-bridge",
    title: "Transcendent Bridge",
    shortDescription: "Extends beyond L2 – a new network layer.",
    icon: Network,
    longDescription:
      "The Transcendent Bridge is a proprietary network extension that operates across all OSI layers, not just L2. It allows us to establish direct, secure channels even in hostile network environments, bypassing DPI and other interference techniques.",
    features: [
      "Cross‑layer packet manipulation",
      "Bypasses deep packet inspection",
      "Dynamic routing around censorship",
      "End‑to‑end encrypted at bridge level",
    ],
    status: "in-development",
    technicalDetails:
      "Technical details will be partially available later.",
  },
  {
    slug: "security-scanners",
    title: "Security Scanners & Detectors",
    shortDescription: "Comprehensive, real‑time threat detection.",
    icon: Shield,
    longDescription:
      "A suite of proprietary scanners that continuously monitor network traffic, memory, and system integrity. They detect anomalies, intrusion attempts, and data leaks before they become threats. Unlike traditional antivirus, these scanners are deeply integrated with kryosette's own protocols.",
    features: [
      "Heuristic analysis of network patterns",
      "Memory integrity verification",
      "Encrypted traffic anomaly detection",
      "Zero‑day exploit mitigation (partially)",
    ],
    status: "in-development",
    technicalDetails:
      "Scanners are written in hand‑optimized C and ASM for minimal overhead. They operate in kernel space with a custom security module for Linux.",
  },
  {
    slug: "onion-routing",
    title: "Proprietary Onion Routing",
    shortDescription: "Anonymous, multi‑layered communication.",
    icon: Lock,
    longDescription:
      "We are developing our own onion routing protocol, independent of Tor. It provides stronger anonymity guarantees and is optimized for the social network's traffic patterns. Nodes are selected based on trust and performance metrics unique to our ecosystem.",
    features: [
      "Multi‑hop encryption",
      "Perfect forward secrecy",
      "Resistant to traffic analysis",
      "Integrated with Transcendent Bridge",
    ],
    status: "in-development",
    technicalDetails:
      "Technical details will be partially available later.",
  },
  {
    slug: "in-memory-db",
    title: "In‑Memory Database",
    shortDescription: "Blazing‑fast, encrypted local storage.",
    icon: Database,
    longDescription:
      "A custom database engine that keeps all active data in RAM while persisting encrypted snapshots to disk. It is designed specifically for social graph operations and provides ACID compliance with microsecond latency.",
    features: [
      "Fully encrypted at rest and in memory",
      "Optimized for graph traversals",
      "Snapshotting with zero downtime",
      "Built‑in checksum verification",
    ],
    status: "in-development",
    technicalDetails:
      "Written in C with a custom memory allocator to prevent fragmentation. Uses AES‑256‑GCM for encryption and BLAKE3 for checksums.",
  },
//   {
//     slug: "rpki-validator",
//     title: "RPKI Validator",
//     shortDescription: "Secure BGP route origin validation.",
//     icon: Shield,
//     longDescription:
//       "An integrated Resource Public Key Infrastructure validator that ensures the kryosette network only communicates with legitimate peers. It prevents BGP hijacking and route leaks, adding an extra layer of trust to the underlying internet routing.",
//     features: [
//       "Real‑time ROA validation",
//       "Automatic cache management",
//       "Alerts on suspicious route changes",
//       "Integration with local routing table",
//     ],
//     status: "in-development",
//     technicalDetails:
//       "Will implement RFC 8210 (RPKI‑to‑Router protocol) with a custom lightweight validator written in Rust for safety and performance.",
//   },
  {
    slug: "transparent-editor",
    title: "Transparent Editor",
    shortDescription: "See every process, change every setting.",
    icon: Edit3,
    longDescription:
      "The Transparent Editor is a real‑time visual interface that exposes the inner workings of kryosette. You can watch packets flow, inspect encryption handshakes, modify routing tables, and tweak security policies – all while the system continues to run.",
    features: [
      "Live process visualization",
      "Configurable policy engine",
      "No hidden settings – everything is editable",
      "Undo/redo with transaction safety",
    ],
    status: "in-development",
    technicalDetails:
      "Technical details will be partially available later.",
  },
  {
    slug: "truth-engine",
    title: "Truth Engine Analyzer",
    shortDescription: "Local AI for content verification.",
    icon: BrainCircuit,
    longDescription:
      "A local, offline analyzer that uses a proprietary truth‑inference engine to flag potential misinformation, manipulated media, or coordinated inauthentic behavior. It runs entirely on your machine and never shares your data.",
    features: [
      "On‑device machine learning models",
      "Real-time detection and prevention of violence, self-harm, and other harmful activities",
      "Network graph analysis for bot detection",
      "Transparent scoring and explanations",
    ],
    status: "planned",
    technicalDetails:
      "Technical details will be partially available later.",
  },
];

export function getTechnologyBySlug(slug: string): Technology | undefined {
  return technologies.find((tech) => tech.slug === slug);
}

export function getAllTechnologySlugs(): string[] {
  return technologies.map((tech) => tech.slug);
}