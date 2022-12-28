import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export const useCurrentTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("")
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const definedTheme = theme === "system" ? systemTheme : theme
    setCurrentTheme(definedTheme ? definedTheme : "light")
  }, [theme])

  return [currentTheme]
}
