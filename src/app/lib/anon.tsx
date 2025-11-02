import { v4 as uuidv4 } from "uuid"

export function getAnonId(): string {
  // Try to get the existing ID
  let id = localStorage.getItem('anon_id')

  // If none, generate a new one
  if (!id) {
    id = uuidv4() // random unique ID
    localStorage.setItem('anon_id', id)
  }

  return id
}