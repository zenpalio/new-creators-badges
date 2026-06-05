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
        "border-v2": {
          DEFAULT: "hsl(var(--border-v2))",
          light: "hsl(var(--light-border-v2))",
        },
        "input-v2": "hsl(var(--input-v2))",
        "ring-v2": "hsl(var(--ring-v2))",
        "background-v2": "hsl(var(--background-v2))",
        "foreground-v2": "hsl(var(--foreground-v2))",
        "primary-v2": {
          DEFAULT: "hsl(var(--primary-v2))",
          light: "hsl(var(--primary-light-v2))",
          dark: "hsl(var(--primary-dark-v2))",
          foreground: "hsl(var(--primary-foreground-v2))",
          disabled: "hsl(var(--primary-disabled-v2))",
        },
        "secondary-v2": {
          DEFAULT: "hsl(var(--secondary-v2))",
          foreground: "hsl(var(--secondary-foreground-v2))",
        },
        "destructive-v2": {
          DEFAULT: "hsl(var(--destructive-v2))",
          foreground: "hsl(var(--destructive-foreground-v2))",
        },
        "muted-v2": {
          DEFAULT: "hsl(var(--muted-v2))",
          foreground: "hsl(var(--muted-foreground-v2))",
        },
        "accent-v2": {
          DEFAULT: "hsl(var(--accent-v2))",
          foreground: "hsl(var(--accent-foreground-v2))",
        },
        "popover-v2": {
          DEFAULT: "hsl(var(--popover-v2))",
          foreground: "hsl(var(--popover-foreground-v2))",
        },
        "card-v2": {
          DEFAULT: "hsl(var(--card-v2))",
          foreground: "hsl(var(--card-foreground-v2))",
        },
        "selection-card-v2": {
          DEFAULT: "hsl(var(--selection-card-v2))",
          border: "hsl(var(--selection-card-border-v2))",
        },
        button: {
          DEFAULT: "#191B1F",
          light: "#343434",
          disabled: "#393939",
          "disabled-text": "#666666",
        },
        "trigger-v2": {
          DEFAULT: "hsl(var(--trigger-v2))",
          border: "hsl(var(--trigger-border-v2))",
        },
        "message-v2": "hsl(var(--message-v2))",
        "success-v2": "hsl(var(--success-v2))",
        "divider-v2": "hsl(var(--divider-v2))",
        "menu-v2": "hsl(var(--menu-v2))",
        "premium-v2": "hsl(var(--premium-v2))",
        "white-secondary-v2": "hsl(var(--white-secondary-v2))",
        "tertiary-text-v2": "hsl(var(--tertiary-text-v2))",
        "grey-dark-1-v2": "hsl(var(--grey-dark-1-v2))",
        "grey-dark-2-v2": "hsl(var(--grey-dark-2-v2))",
        "grey-dark-3-v2": "hsl(var(--grey-dark-3-v2))",
        "grey-light-1-v2": "hsl(var(--grey-light-1-v2))",
        "grey-light-2-v2": "hsl(var(--grey-light-2-v2))",
        "grey-light-3-v2": "hsl(var(--grey-light-3-v2))",
        "grey-light-4-v2": "hsl(var(--grey-light-4-v2))",
        "accent-yellow-v2": "hsl(var(--accent-yellow-v2))",
        "system-red-v2": "hsl(var(--system-red-v2))",
        "sidebar-v2": {
          DEFAULT: "hsl(var(--sidebar-bg-v2))",
          foreground: "hsl(var(--sidebar-fg-v2))",
          hover: "hsl(var(--sidebar-hover-v2))",
          active: "hsl(var(--sidebar-active-v2))",
          "active-foreground": "hsl(var(--sidebar-active-fg-v2))",
        },
        "tag-v2": {
          DEFAULT: "hsl(var(--tag-bg-v2))",
          foreground: "hsl(var(--tag-fg-v2))",
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
          "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, hsl(var(--primary-v2)) 20%, hsl(var(--primary-dark-v2)) 80%, hsl(var(--primary-dark-v2)) 100%)",
        "secondary-gradient":
          "linear-gradient(90deg, #F04438 0%, #F04438 20%, #F87171 80%, #F87171 100%)",
        "secondary-light-gradient":
          "linear-gradient(180deg, #F87171 37.94%, #F5542C 100%)",
        "active-stories": 'url("/active-stories.svg")',
        "active-card":
          "linear-gradient(180deg, hsl(var(--message-v2)) 45%, hsl(var(--primary-v2)) 100%)",
        "card-gradient": "linear-gradient(90deg, #0e0f11 45%, #191B1F 100%)",
        "countdown-card":
          "linear-gradient(90deg, hsl(var(--secondary-v2)) 0%, hsl(var(--primary-v2)) 100%)",
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
        dialog: "0px 12px 24px -6px hsl(var(--primary-v2))",
        "user-message": "0px 1px 40px -6px hsl(var(--primary-v2))",
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
            fill: "var(--secondary-v2)",
            color: "var(--secondary-v2)",
          },
          "100%": {
            height: "26px",
            width: "26px",
            fill: "var(--secondary-v2)",
            color: "var(--secondary-v2)",
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
            fill: "var(--background-v2)",
            color: "var(--primary-v2)",
          },
          "100%": {
            height: "30px",
            width: "30px",
            fill: "hsl(var(--background-v2))",
            color: "hsl(var(--primary-v2))",
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
              "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, rgba(196, 196, 196, 1) 20%)",
          },
          "10%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, rgba(196, 196, 196, 1) 30%)",
          },
          "20%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, rgba(196, 196, 196, 1) 40%)",
          },
          "30%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, rgba(196, 196, 196, 1) 50%)",
          },
          "40%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, rgba(196, 196, 196, 1) 60%)",
          },
          "50%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 0%, rgba(196, 196, 196, 1) 70%)",
          },
          "60%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 20%, rgba(196, 196, 196, 1) 80%)",
          },
          "70%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 40%, rgba(196, 196, 196, 1) 90%)",
          },
          "80%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 60%, rgba(196, 196, 196, 1) 100%)",
          },
          "90%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 80%, rgba(196, 196, 196, 1) 100%)",
          },
          "100%": {
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary-v2)) 100%, rgba(196, 196, 196, 1) 100%)",
          },
        },
        "pop-float": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.2" },
          "50%": { transform: "translateY(-30px)", opacity: "0.8" },
        },
        "pop-rise": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pop-burst": {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "60%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pop-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "pop-pulse-soft": {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.03)", filter: "brightness(1.15)" },
        },
        "pop-dot": {
          "0%, 80%, 100%": { opacity: "0.2" },
          "40%": { opacity: "1" },
        },
        "pop-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
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
        "pop-float": "pop-float 7s ease-in-out infinite",
        "pop-rise": "pop-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pop-burst": "pop-burst 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pop-pulse": "pop-pulse 1.4s ease-in-out infinite",
        "pop-pulse-soft": "pop-pulse-soft 2s ease-in-out infinite",
        "pop-dot": "pop-dot 1.2s ease-in-out infinite",
        "pop-blink": "pop-blink 1s steps(2, end) infinite",
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
          backgroundColor: theme("colors.primary-v2.DEFAULT"),
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
