/** Inline validation message; link it from the field with aria-describedby={id}. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="type-small text-negative">
      {message}
    </p>
  )
}
