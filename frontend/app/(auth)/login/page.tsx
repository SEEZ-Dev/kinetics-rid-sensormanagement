"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Droplets } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { t, language, changeLanguage } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)

      if (success) {
        router.push("/dashboard")
      } else {
        toast({
          title: t("auth.error"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: t("app.error"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex flex-col">
      {/* Header with language selector */}
      <header className="w-full p-4 flex justify-end">
        <Tabs
          defaultValue={language}
          className="w-[200px]"
          onValueChange={(value) => changeLanguage(value as "en" | "th")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="th">ไทย</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-primary/20">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                <Droplets className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-bold">{t("auth.login")}</CardTitle>
            <CardDescription className="text-center text-base">Sensor & Reservoir Monitoring System</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input
                  id="username"
                  placeholder={language === "en" ? "Enter username" : "ใส่ชื่อผู้ใช้"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={language === "en" ? "Enter password" : "ใส่รหัสผ่าน"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  {t("auth.remember")}
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit" disabled={isLoading} size="lg">
                {isLoading ? t("app.loading") : t("auth.submit")}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                {language === "en"
                  ? "Demo credentials: Username 'admin' or 'viewer', Password 'password'"
                  : "ข้อมูลสำหรับทดลอง: ชื่อผู้ใช้ 'admin' หรือ 'viewer', รหัสผ่าน 'password'"}
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      <footer className="p-4 text-center text-xs text-muted-foreground">
        <p>© 2025 Kenetic Monitoring System</p>
      </footer>
    </div>
  )
}
