/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
        },
        // Primary
        primary: {
          DEFAULT: "var(--primary-main)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
          contrast: "var(--primary-contrast)",
          gradient: {
            DEFAULT: "var(--primary-gradient)",
            hover: "var(--primary-gradient-hover)",
          },
        },
        // Content
        content: {
          primary: "var(--content-primary)",
          secondary: "var(--content-secondary)",
          contrast: "var(--content-contrast)",
          success: "var(--success-content)",
          error: "var(--error-content)",
        },
        // Success
        success: "var(--success-main)",
        // Error
        error: "var(--error-main)",
        // Warning
        warning: "var(--warning-main)",
        // Outline
        outline: {
          DEFAULT: "var(--outline-main)",
          secondary: "var(--outline-secondary)",
        },
      },
      fontFamily: {
        inter: "'Inter', sans-serif",
      },
      fontSize: {
        "heading-3": [
          "var(--fs-2xl)",
          {
            lineHeight: "var(--lh-leading-10)",
            letterSpacing: "var(---ls-tracking-1)",
          },
        ],
        "heading-4": [
          "var(--fs-xl)",
          {
            lineHeight: "var(--lh-leading-8)",
            letterSpacing: "var(---ls-tracking-1)",
          },
        ],
        "heading-5": [
          "var(--fs-lg)",
          {
            lineHeight: "var(--lh-leading-7)",
            letterSpacing: "var(---ls-tracking-1)",
          },
        ],
        "subtitle": [
          "var(--fs-base)",
          {
            lineHeight: "var(--lh-leading-6)",
            letterSpacing: "var(--ls-tracking-1)",
          },
        ],
        "body": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-5)",
          },
        ],
        "subtitle-sm": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-6)",
            letterSpacing: "var(---ls-tracking-2)",
          },
        ],
        "avatar-title": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-4)",
            letterSpacing: "var(---ls-tracking-2)",
          },
        ],
        "button": [
          "var(--fs-sm)",
          {
            lineHeight: "var(--lh-leading-6)",
          },
        ],
        "caption": [
          "var(--fs-xs)",
          {
            lineHeight: "var(--lh-leading-4)",
          },
        ],
        "button-sm": [
          "var(--fs-xs)",
          {
            lineHeight: "var(--lh-leading-3)",
          },
        ],
        "caption-sm": [
          "var(--fs-xxs)",
          {
            lineHeight: "var(--lh-leading-3)",
          },
        ],
      },
      boxShadow: {
        2: "var(--bs-shadow-2)",
        3: "var(--bs-shadow-3)",
        backdrop: "var(--bs-shadow-backdrop)",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addComponents }) {
      addComponents({
        ".container": {
          "maxWidth": "100%",
          "marginLeft": "auto",
          "marginRight": "auto",
          // "paddingLeft": "1rem",
          // "paddingRight": "1rem",
          "@screen sm": {
            maxWidth: "100%",
          },
          "@screen md": {
            maxWidth: "100%",
          },
          "@screen lg": {
            maxWidth: "1024px",
          },
          "@screen xl": {
            maxWidth: "1200px",
            paddingLeft: "2.5rem",
            paddingRight: "2.5rem",
          },
          "@screen 2xl": {
            maxWidth: "1456px",
            paddingLeft: "2.5rem",
            paddingRight: "2.5rem",
          },
        },
      });
    },
  ],
};
