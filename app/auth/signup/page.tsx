'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      })

      if (response.redirected) {
        const url = new URL(response.url)
        const message = url.searchParams.get('message')
        const error = url.searchParams.get('error')

        if (error) {
          setError(error)
        } else if (message) {
          setMessage(message)
        }
      } else {
        const result = await response.json()
        if (result.error) {
          setError(result.error)
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error al crear el usuario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-6'>
      <div className='w-full max-w-md'>
        <Card className='glass-strong shadow-2xl'>
          <CardHeader className='text-center space-y-4'>
            <div className='flex justify-center'>
              <Image src='/logo.jpg' alt='CRM OBJETIVO Logo' width={120} height={60} className='object-contain' />
            </div>
            <CardTitle className='text-2xl font-bold text-primary'>Crear Usuario</CardTitle>
            <CardDescription className='text-muted-foreground'>
              Crea un nuevo usuario para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='email@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='glass'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='********'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='glass'
                />
              </div>
              {error && <p className='text-sm text-destructive bg-destructive/10 p-2 rounded'>{error}</p>}
              {message && <p className='text-sm text-green-600 bg-green-600/10 p-2 rounded'>{message}</p>}
              <Button type='submit' className='w-full bg-primary hover:bg-primary/90' disabled={isLoading}>
                {isLoading ? 'Creando usuario...' : 'Crear Usuario'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
