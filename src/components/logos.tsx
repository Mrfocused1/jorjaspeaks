import type { Logo } from './LogoCarousel';

// Sample company/organization logos
export const CompanyLogo1 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="10" y="10" width="60" height="60" rx="8" fill="#1a1a1a" />
    <text x="40" y="50" fontSize="32" fontWeight="700" fill="white" textAnchor="middle">TC</text>
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">TechCorp</text>
  </svg>
);

export const CompanyLogo2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="40" cy="40" r="30" fill="#0066cc" />
    <path d="M 40 15 L 55 40 L 40 65 L 25 40 Z" fill="white" />
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">InnovateCo</text>
  </svg>
);

export const CompanyLogo3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="10" y="20" width="60" height="40" rx="4" fill="#004080" />
    <rect x="20" y="30" width="40" height="20" rx="2" fill="white" />
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">GlobalEnt</text>
  </svg>
);

export const CompanyLogo4 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 40 10 L 60 30 L 60 50 L 40 70 L 20 50 L 20 30 Z" fill="#0052a3" />
    <circle cx="40" cy="40" r="12" fill="white" />
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">FutureNow</text>
  </svg>
);

export const CompanyLogo5 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="15" y="15" width="50" height="50" rx="25" fill="#003366" />
    <path d="M 40 25 L 45 35 L 55 35 L 47 42 L 50 52 L 40 45 L 30 52 L 33 42 L 25 35 L 35 35 Z" fill="white" />
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">Summit Inc</text>
  </svg>
);

export const CompanyLogo6 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="10" y="10" width="60" height="60" rx="30" fill="#00264d" />
    <text x="40" y="50" fontSize="28" fontWeight="700" fill="white" textAnchor="middle">VX</text>
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">Vortex Ltd</text>
  </svg>
);

export const CompanyLogo7 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M 10 40 L 40 10 L 70 40 L 40 70 Z" fill="#001a33" />
    <path d="M 25 40 L 40 25 L 55 40 L 40 55 Z" fill="white" />
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">Nexus Group</text>
  </svg>
);

export const CompanyLogo8 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="40" cy="40" r="28" fill="#0066cc" />
    <rect x="28" y="25" width="24" height="30" rx="2" fill="white" />
    <text x="90" y="45" fontSize="24" fontWeight="600" fill="white">Elevate Corp</text>
  </svg>
);

export const logos: Logo[] = [
  { id: 1, name: "TechCorp", img: CompanyLogo1 },
  { id: 2, name: "InnovateCo", img: CompanyLogo2 },
  { id: 3, name: "GlobalEnt", img: CompanyLogo3 },
  { id: 4, name: "FutureNow", img: CompanyLogo4 },
  { id: 5, name: "Summit Inc", img: CompanyLogo5 },
  { id: 6, name: "Vortex Ltd", img: CompanyLogo6 },
  { id: 7, name: "Nexus Group", img: CompanyLogo7 },
  { id: 8, name: "Elevate Corp", img: CompanyLogo8 },
];
