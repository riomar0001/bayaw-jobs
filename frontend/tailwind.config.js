/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                lochmara: {
                    50: "#f1f8fe",
                    100: "#e1effd",
                    200: "#bddffa",
                    300: "#83c5f6",
                    400: "#41a7ef",
                    500: "#1783d0",
                    600: "#0c6ebd",
                    700: "#0b5899",
                    800: "#0d4b7f",
                    900: "#114069",
                    950: "#0b2846",
                },
                tussock: {
                    50: "#faf6ec",
                    100: "#f2e9cf",
                    200: "#e6d2a2",
                    300: "#d8b46c",
                    400: "#cc9945",
                    500: "#bc8336",
                    600: "#a2672c",
                    700: "#824c26",
                    800: "#6d3f26",
                    900: "#5e3625",
                    950: "#361c12",
                },
                thunderbird: {
                    50: "#fff0f0",
                    100: "#ffdede",
                    200: "#ffc2c2",
                    300: "#ff9898",
                    400: "#ff5c5c",
                    500: "#ff2a2a",
                    600: "#f80a0a",
                    700: "#df0404",
                    800: "#ac0808",
                    900: "#8e0e0e",
                    950: "#4e0101",
                },
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: "0",
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: "0",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
