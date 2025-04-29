"use client"

import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("app.settings")}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("app.theme")}</CardTitle>
            <CardDescription>
              {t("app.theme")} {t("app.settings").toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue={theme} onValueChange={setTheme} className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light">{t("app.light")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark">{t("app.dark")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">{t("app.system")}</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("app.language")}</CardTitle>
            <CardDescription>
              {t("app.language")} {t("app.settings").toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={language}
              onValueChange={(value) => changeLanguage(value as "en" | "th")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="th" id="lang-th" />
                <Label htmlFor="lang-th">ไทย</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
