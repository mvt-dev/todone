'use client'

import { useActionState } from 'react'
import { signin } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'

export default function SignIn() {
  const [errorMessage, formAction, isPending] = useActionState(signin, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </Field>
      </FieldGroup>
      {errorMessage && (
        <FieldError>{errorMessage}</FieldError>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
