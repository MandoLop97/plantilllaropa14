
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
                                primary: {
                                        DEFAULT: 'hsl(var(--color-primary) / <alpha-value>)',
                                        foreground: 'hsl(var(--primary-foreground))',
                                        50: 'hsl(var(--color-primary-50) / <alpha-value>)',
                                        100: 'hsl(var(--color-primary-100) / <alpha-value>)',
                                        200: 'hsl(var(--color-primary-200) / <alpha-value>)',
                                        300: 'hsl(var(--color-primary-300) / <alpha-value>)',
                                        400: 'hsl(var(--color-primary-400) / <alpha-value>)',
                                        500: 'hsl(var(--color-primary-500) / <alpha-value>)',
                                        600: 'hsl(var(--color-primary-600) / <alpha-value>)',
                                        700: 'hsl(var(--color-primary-700) / <alpha-value>)',
                                        800: 'hsl(var(--color-primary-800) / <alpha-value>)',
                                        900: 'hsl(var(--color-primary-900) / <alpha-value>)',
                                        950: 'hsl(var(--color-primary-950) / <alpha-value>)'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--color-secondary) / <alpha-value>)',
                                        foreground: 'hsl(var(--secondary-foreground))',
                                        50: 'hsl(var(--color-secondary-50) / <alpha-value>)',
                                        100: 'hsl(var(--color-secondary-100) / <alpha-value>)',
                                        200: 'hsl(var(--color-secondary-200) / <alpha-value>)',
                                        300: 'hsl(var(--color-secondary-300) / <alpha-value>)',
                                        400: 'hsl(var(--color-secondary-400) / <alpha-value>)',
                                        500: 'hsl(var(--color-secondary-500) / <alpha-value>)',
                                        600: 'hsl(var(--color-secondary-600) / <alpha-value>)',
                                        700: 'hsl(var(--color-secondary-700) / <alpha-value>)',
                                        800: 'hsl(var(--color-secondary-800) / <alpha-value>)',
                                        900: 'hsl(var(--color-secondary-900) / <alpha-value>)',
                                        950: 'hsl(var(--color-secondary-950) / <alpha-value>)'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--color-accent) / <alpha-value>)',
                                        foreground: 'hsl(var(--accent-foreground))',
                                        50: 'hsl(var(--color-accent-50) / <alpha-value>)',
                                        100: 'hsl(var(--color-accent-100) / <alpha-value>)',
                                        200: 'hsl(var(--color-accent-200) / <alpha-value>)',
                                        300: 'hsl(var(--color-accent-300) / <alpha-value>)',
                                        400: 'hsl(var(--color-accent-400) / <alpha-value>)',
                                        500: 'hsl(var(--color-accent-500) / <alpha-value>)',
                                        600: 'hsl(var(--color-accent-600) / <alpha-value>)',
                                        700: 'hsl(var(--color-accent-700) / <alpha-value>)',
                                        800: 'hsl(var(--color-accent-800) / <alpha-value>)',
                                        900: 'hsl(var(--color-accent-900) / <alpha-value>)',
                                        950: 'hsl(var(--color-accent-950) / <alpha-value>)'
                                },
                                neutral: {
                                        50: 'hsl(var(--color-neutral-50) / <alpha-value>)',
                                        100: 'hsl(var(--color-neutral-100) / <alpha-value>)',
                                        200: 'hsl(var(--color-neutral-200) / <alpha-value>)',
                                        300: 'hsl(var(--color-neutral-300) / <alpha-value>)',
                                        400: 'hsl(var(--color-neutral-400) / <alpha-value>)',
                                        500: 'hsl(var(--color-neutral-500) / <alpha-value>)',
                                        600: 'hsl(var(--color-neutral-600) / <alpha-value>)',
                                        700: 'hsl(var(--color-neutral-700) / <alpha-value>)',
                                        800: 'hsl(var(--color-neutral-800) / <alpha-value>)',
                                        900: 'hsl(var(--color-neutral-900) / <alpha-value>)',
                                        950: 'hsl(var(--color-neutral-950) / <alpha-value>)'
                                },
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
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
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'shimmer': 'shimmer 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
