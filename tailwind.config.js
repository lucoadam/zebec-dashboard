/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minWidth: {
        7: "28px",
        31.25: "125px",
        33.5: "134px",
        48: "195",
        50: "200px",
        51: "203px",
        55.5: "222px",
        60: "240px",
        70: "280px",
        84: "335px",
        85: "340px",
        175: "706"
      },
      colors: {
        black: "var(--black)",
        white: "var(--white)",
        // Background
        background: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          light: "var(--bg-light)",
          muted: "var(--bg-muted)",
          backdrop: "var(--bg-backdrop)",
          contrast: "var(--bg-contrast)",
          tooltip: "var(--toltip-background)"
        },
        // Primary
        primary: {
          DEFAULT: "var(--primary-main)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
          contrast: "var(--primary-contrast)",
          gradient: {
            DEFAULT: "var(--primary-gradient)",
            hover: "var(--primary-gradient-hover)"
          }
        },
        // Content
        content: {
          primary: "var(--content-primary)",
          secondary: "var(--content-secondary)",
          tertiary: "var(--content-tertiary)",
          contrast: "var(--content-contrast)",
          success: "var(--success-content)",
          error: "var(--error-content)"
        },
        // Success
        success: {
          DEFAULT: "var(--success-main)",
          content: "var(--success-content)"
        },
        // Error
        error: {
          DEFAULT: "var(--error-main)",
          content: "var(--error-content)"
        },
        // Warning
        warning: "var(--warning-main)",
        // Outline
        outline: {
          DEFAULT: "var(--outline-main)",
          secondary: "var(--outline-secondary)",
          icon: "var(--outline-icon)",
          dark: "var(--outline-dark)"
        }
      },
      fontFamily: {
        inter: "'Inter', sans-serif"
      },
      fontSize: {
        "heading-3": [
          "var(--fs-2xl)",
          {
            lineHeight: "var(--lh-leading-10)",
            letterSpacing: "var(---ls-tracking-1)"
          }
        ],
        "heading-4": [
          "var(--fs-xl)",
          {
            lineHeight: "var(--lh-leading-8)",
            letterSpacing: "var(---ls-tracking-1)"
          }
        ],
        "heading-5": [
          "var(--fs-lg)",
          {
            lineHeight: "var(--lh-leading-7)",
            letterSpacing: "var(---ls-tracking-1)"
          }
        ],
        subtitle: [
          "var(--fs-base)",
          {
            lineHeight: "var(--lh-leading-6)",
            letterSpacing: "var(--ls-tracking-1)"
          }
        ],
        body: [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-5)"
          }
        ],
        "subtitle-sm": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-6)",
            letterSpacing: "var(---ls-tracking-2)"
          }
        ],
        "avatar-title": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-4)",
            letterSpacing: "var(---ls-tracking-2)"
          }
        ],
        button: [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-6)"
          }
        ],
        caption: [
          "var(--fs-xs)",
          {
            lineHeight: "var(--lh-leading-4)"
          }
        ],
        "button-sm": [
          "var(--fs-xs)",
          {
            lineHeight: "var(--lh-leading-3)"
          }
        ],
        "caption-sm": [
          "var(--fs-xxs)",
          {
            lineHeight: "var(--lh-leading-3)"
          }
        ]
      },
      boxShadow: {
        2: "var(--bs-shadow-2)",
        3: "var(--bs-shadow-3)",
        backdrop: "var(--bs-shadow-backdrop)",
        toaster: "var(--bs-shadow-toaster)"
      },
      letterSpacing: {
        1: "var(--ls-tracking-1)"
      },
      spacing: {
        3.5: "14px",
        4.5: "18px"
      },
      container: {
        center: true
      },
      keyframes: {
        progress: {
          "0%": { width: "100%" },
          "100%": { width: "0" }
        }
      },
      animation: {
        progress: "progress linear"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          "@screen sm": {
            maxWidth: "100%"
          },
          "@screen md": {
            maxWidth: "100%"
          },
          "@screen lg": {
            maxWidth: "1024px"
          },
          "@screen xl": {
            maxWidth: "1200px",
            paddingLeft: "2.5rem",
            paddingRight: "2.5rem"
          },
          "@screen 2xl": {
            maxWidth: "1456px",
            paddingLeft: "2.5rem",
            paddingRight: "2.5rem"
          }
        }
      })
    }
  ]
}
