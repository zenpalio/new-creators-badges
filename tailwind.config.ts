/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { staticAssetPath } from "./src/lib/utils";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  future: {
    hoverOnlyWhenSupported: true,
  },
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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        "0.5": "2.5px",
        "1": "5px",
        "1.5": "7.5px",
        "2": "10px",
        "2.5": "12.5px",
        "3": "15px",
        "3.5": "17.5px",
        "4": "20px",
        "4.5": "22.5px",
        "5": "25px",
        "5.5": "27.5px",
        "6": "30px",
        "6.5": "32.5px",
        "7": "35px",
        "7.5": "37.5px",
        "8": "40px",
        "8.5": "42.5px",
        "9": "45px",
        "9.5": "47.5px",
        "10": "50px",
        "10.5": "52.5px",
        "11": "55px",
        "11.5": "57.5px",
        "12": "60px",
        "12.5": "62.5px",
        "13": "65px",
        "13.5": "67.5px",
        "14": "70px",
        "14.5": "72.5px",
        "15": "75px",
        "15.5": "77.5px",
        "16": "80px",
        "16.5": "82.5px",
        "17": "85px",
        "17.5": "87.5px",
        "18": "90px",
        "18.5": "92.5px",
        "19": "95px",
        "19.5": "97.5px",
        "20": "100px",
        "header-height": "var(--header-height)",
        "sidebar-width": "var(--sidebar-width)",
        "gallery-sidebar-width": "var(--gallery-sidebar-width)",
      },
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          light: "hsl(var(--light-border))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
          disabled: "hsl(var(--primary-disabled))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "popover-v2": {
          DEFAULT: "hsl(var(--popover-v2))",
          foreground: "hsl(var(--popover-foreground-v2))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "selection-card": {
          DEFAULT: "hsl(var(--selection-card))",
          border: "hsl(var(--selection-card-border))",
        },
        button: {
          DEFAULT: "#191B1F",
          light: "#343434",
          disabled: "#393939",
          "disabled-text": "#666666",
        },
        trigger: {
          DEFAULT: "hsl(var(--trigger))",
          border: "hsl(var(--trigger-border))",
        },
        message: "hsl(var(--message))",
        success: "hsl(var(--success))",
        divider: "hsl(var(--divider))",
        menu: "hsl(var(--menu))",
        premium: "hsl(var(--premium))",
        "white-secondary": "hsl(var(--white-secondary))",
        "tertiary-text": "hsl(var(--tertiary-text))",
        "grey-dark-1": "hsl(var(--grey-dark-1))",
        "grey-dark-2": "hsl(var(--grey-dark-2))",
        "grey-dark-3": "hsl(var(--grey-dark-3))",
        "grey-light-1": "hsl(var(--grey-light-1))",
        "grey-light-2": "hsl(var(--grey-light-2))",
        "grey-light-3": "hsl(var(--grey-light-3))",
        "grey-light-4": "hsl(var(--grey-light-4))",
        "accent-yellow": "hsl(var(--accent-yellow))",
        "system-red": "hsl(var(--system-red))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--sidebar-fg))",
          hover: "hsl(var(--sidebar-hover))",
          active: "hsl(var(--sidebar-active))",
          "active-foreground": "hsl(var(--sidebar-active-fg))",
        },
        tag: {
          DEFAULT: "hsl(var(--tag-bg))",
          foreground: "hsl(var(--tag-fg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontWeight: {
        light: "200",
        medium: "400",
        bold: "700",
        extrabold: "1000",
      },
      fontFamily: {
        onest: ["var(--font-onest)", "sans-serif"],
        rubik: ["var(--font-rubik)", "sans-serif"],
      },
      backgroundImage: {
        shade:
          "linear-gradient(180deg, rgba(0, 0, 0, 0.01) 0%, rgba(0, 0, 0, 1) 100%)",
        "primary-gradient":
          "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 20%, hsl(var(--primary-dark)) 80%, hsl(var(--primary-dark)) 100%)",
        "secondary-gradient":
          "linear-gradient(90deg, #F04438 0%, #F04438 20%, #F87171 80%, #F87171 100%)",
        "secondary-light-gradient":
          "linear-gradient(180deg, #F87171 37.94%, #F5542C 100%)",
        "active-stories": 'url("/active-stories.svg")',
        "active-card":
          "linear-gradient(180deg, hsl(var(--message)) 45%, hsl(var(--primary)) 100%)",
        "card-gradient": "linear-gradient(90deg, #0e0f11 45%, #191B1F 100%)",
        "countdown-card":
          "linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)",
        footer:
          "linear-gradient(30deg, #0B0C14 0%, rgba(0, 121, 255, 0.30) 30%, rgba(0, 121, 255, 0.30) 60%, #0B0C14 100%)",
        "generator-queue":
          "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/generator/queue.png')",
        toast: "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75))",
        "welcome-offer": `url('${staticAssetPath("/images/dialog/valentine-offer-bg-v2.jpg")}')`,
      },
      boxShadow: {
        unlock: "0px 1px 5px 2px rgba(245, 84, 44, 0.5)",
        login: "0px 1px 5px 2px rgba(0, 121, 255, 0.5)",
        private: "0px 1px 20px 0px rgba(245, 84, 44, 1)",
        dialog: "0px 12px 24px -6px hsl(var(--primary))",
        "user-message": "0px 1px 40px -6px hsl(var(--primary))",
        "selected-subscription":
          "0px 1px 15px 0px rgba(148, 148, 148, 0.50)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        rotate: {
          from: {
            transform: "translate(-50%, -50%) scale(1.4) rotate(0turn)",
          },
          to: {
            transform: "translate(-50%, -50%) scale(1.4) rotate(1turn)",
          },
        },
        "gradient-x": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "50% 50%" },
        },
        "loading-dot": {
          "0%": {
            height: "4px",
            width: "4px",
            backgroundColor: "rgba(245, 84, 44, 1)",
          },
          "25%": {
            height: "6px",
            width: "6px",
            backgroundColor: "rgba(245, 84, 44, 0.60)",
          },
          "50%": {
            height: "8px",
            width: "8px",
            backgroundColor: "rgba(245, 84, 44, 1)",
          },
          "75%": {
            height: "6px",
            width: "6px",
            backgroundColor: "rgba(245, 84, 44, 0.60)",
          },
          "100%": {
            height: "4px",
            width: "4px",
            backgroundColor: "#F5542C",
          },
        },
        like: {
          "0%": {
            height: "30px",
            width: "30px",
            fill: "var(--secondary)",
            color: "var(--secondary)",
          },
          "100%": {
            height: "26px",
            width: "26px",
            fill: "var(--secondary)",
            color: "var(--secondary)",
          },
        },
        soundbar: {
          "0%": { opacity: ".35", height: "3px" },
          "100%": { opacity: "1", height: "16px" },
        },
        dislike: {
          "0%": {
            height: "26px",
            width: "26px",
            fill: "var(--background)",
            color: "var(--primary)",
          },
          "100%": {
            height: "30px",
            width: "30px",
            fill: "hsl(var(--background))",
            color: "hsl(var(--primary))",
          },
        },
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "shrink-horizontal": {
          from: { transform: "scaleX(1)" },
          to: { transform: "scaleX(0)" },
        },
        slideIn: {
          from: { transform: "translateX(calc(100% + 25px))" },
          to: { transform: "translateX(0)" },
        },
        "loading-horizontal": {
          "0%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, rgba(196, 196, 196, 1) 20%)",
          },
          "10%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, rgba(196, 196, 196, 1) 30%)",
          },
          "20%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, rgba(196, 196, 196, 1) 40%)",
          },
          "30%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, rgba(196, 196, 196, 1) 50%)",
          },
          "40%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, rgba(196, 196, 196, 1) 60%)",
          },
          "50%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, rgba(196, 196, 196, 1) 70%)",
          },
          "60%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 20%, rgba(196, 196, 196, 1) 80%)",
          },
          "70%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 40%, rgba(196, 196, 196, 1) 90%)",
          },
          "80%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 60%, rgba(196, 196, 196, 1) 100%)",
          },
          "90%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 80%, rgba(196, 196, 196, 1) 100%)",
          },
          "100%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)) 100%, rgba(196, 196, 196, 1) 100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        rotate: "rotate 2s linear infinite",
        "loading-dot": "loading-dot 1.2s ease-out infinite",
        like: "like 0.4s cubic-bezier(.74,-0.73,0,2.12)",
        dislike: "dislike 0.4s cubic-bezier(.74,-0.73,0,2.12)",
        "loading-horizontal":
          "loading-horizontal 2s linear infinite alternate",
        "slide-in": "slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        hide: "hide 100ms ease-in",
        "shrink-horizontal":
          "shrink-horizontal 150ms ease-in forwards",
        "gradient-x": "gradient-x 0.5s ease forwards",
        soundbar: "soundbar 0ms -600ms linear infinite alternate",
      },
      animationDelay: {
        "300ms": "0.3s",
        "600ms": "0.6s",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-textshadow"),
    // @tailwindcss/line-clamp is included by default in Tailwind v3.3+
    function ({
      addUtilities,
      theme,
    }: {
      addUtilities: (
        utilities: Record<string, any>,
        variants?: string[]
      ) => void;
      theme: (key: string) => any;
    }) {
      const gradientText = {
        ".text-gradient-secondary": {
          backgroundImage: theme("backgroundImage.secondary-gradient"),
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          transition: "background-position 0.4s ease, opacity 0.4s ease",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 50%",
        },
        ".hover\\:text-gradient-secondary:hover": {
          backgroundPosition: "50% 50%",
        },
      };
      addUtilities(gradientText, ["responsive", "hover"]);
    },
    function ({
      addUtilities,
      theme,
    }: {
      addUtilities: (
        utilities: Record<string, any>,
        variants?: string[]
      ) => void;
      theme: (key: string) => any;
    }) {
      addUtilities({
        ".bg-gradient-secondary": {
          backgroundImage: theme("backgroundImage.secondary-gradient"),
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 50%",
          transition:
            "background-position 0.4s ease, filter 400ms ease, opacity 400ms ease",
        },
        ".bg-gradient-secondary:hover": {
          backgroundPosition: "50% 50%",
        },
        ".bg-gradient-secondary:disabled": {
          backgroundPosition: "50% 50%",
          filter: "grayscale(100%) brightness(0.85)",
          opacity: "0.7",
          cursor: "not-allowed",
          transition:
            "background-position 0.4s ease, filter 400ms ease, opacity 400ms ease",
        },
        ".bg-gradient-primary": {
          backgroundImage: theme("backgroundImage.primary-gradient"),
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 50%",
          transition:
            "background-position 0.4s ease, filter 400ms ease, opacity 400ms ease",
        },
        ".bg-gradient-primary:hover": {
          backgroundPosition: "50% 50%",
        },
        ".bg-gradient-primary:disabled": {
          backgroundPosition: "50% 50%",
          filter: "grayscale(60%) brightness(0.85)",
          opacity: "0.7",
          cursor: "not-allowed",
          transition:
            "background-position 0.4s ease, filter 400ms ease, opacity 400ms ease",
        },
        ".bg-primary-solid": {
          backgroundColor: theme("colors.primary.DEFAULT"),
        },
      });
    },
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
    }) {
      addUtilities({
        ".delay-300ms": { "animation-delay": "0.3s" },
        ".delay-600ms": { "animation-delay": "0.6s" },
      });
    },
  ],
  variants: {
    extend: {
      backgroundColor: ["is-disabled"],
      borderColor: ["is-disabled"],
      textColor: ["is-disabled"],
    },
  },
} satisfies Config;

export default config;
