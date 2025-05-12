
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/utils/financeUtils';
import { sortDebtsForAvalanche, sortDebtsForSnowball } from '@/utils/financeUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import html2canvas from 'html2canvas';

interface Debt {
  id: number;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

const DebtCalculator: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Credit Card', balance: 15000, interestRate: 19.5, minimumPayment: 500 },
    { id: 2, name: 'Car Loan', balance: 80000, interestRate: 12, minimumPayment: 2500 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(1000);
  const [useAvalanche, setUseAvalanche] = useState<boolean>(true);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const { toast } = useToast();
  const { canDownload, incrementDownloadCount, userTier } = useUser();

  // Calculate totals
  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);

  // Add a new empty debt
  const addDebt = () => {
    const newId = debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1;
    setDebts([...debts, { id: newId, name: '', balance: 0, interestRate: 0, minimumPayment: 0 }]);
  };

  //I'm inspired by your concept for a personal finance toolkit! Let's create a sleek, user-friendly application that helps South African users manage their finances effectively. 

The design evokes modern fintech apps like Mint, YNAB, and PocketGuard, with clean interfaces and intuitive controls. I'll implement a responsive design with a calming color palette of blues and greens to convey financial stability and growth.

For this first version, I'll build:

1. A dashboard-style homepage with access to all six financial tools
2. Fully working frontend logic for each tool
3. A freemium model with tier-based feature restrictions
4. Responsive design for mobile and desktop users
5. LocalStorage integration for saving user data

**Design Elements:**
- Color Palette: Teal primary (#2DD4BF), Navy accent (#0F172A), Light gray background (#F8FAFC)
- Typography: Clean sans-serif font (Inter) for readability
- Layout: Sidebar navigation for desktop, bottom tabs for mobile
- Visual Elements: Simple charts and progress indicators
- Interactive Elements: Toggles, sliders, and input fields with immediate feedback

Let's start building your personal finance toolkit!

<lov-code>
Files to work on:
1. tailwind.config.ts (customizing color palette)
2. src/index.css (customizing fonts)
3. src/App.tsx (routing setup)
4. src/components/Layout components
5. src/pages/Index.tsx (dashboard)
6. Individual tool components
7. Premium tier components
8. Data files for tools

Let's start by updating the tailwind configuration and adding our fonts:

<lov-write file_path="tailwind.config.ts">
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom theme colors
				teal: {
					50: '#f0fdfa',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
					800: '#115e59',
					900: '#134e4a',
					950: '#042f2e',
				},
				navy: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
					950: '#020617',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				}
			},
			animation: {
				"accordion-down": 'accordion-down 0.2s ease-out',
				"accordion-up": 'accordion-up 0.2s ease-out',
				"fade-in": 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
