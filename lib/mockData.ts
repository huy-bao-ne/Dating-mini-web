// Mock profile data for testing without backend
import { generateManyMockProfiles } from './mock-data/generateMockProfiles'

// Generate 250 mock profiles with simple data
const baseMockProfiles = generateManyMockProfiles(250)

export const mockProfiles = baseMockProfiles.map((profile) => ({
  id: profile.id,
  firstName: profile.firstName,
  lastName: profile.lastName,
  name: profile.name,
  age: profile.age,
  gender: profile.gender as 'male' | 'female' | 'other',
  bio: profile.bio,
  email: profile.email,
  password: profile.password,
  avatar: profile.avatar,
  createdAt: profile.createdAt,
  height: profile.height,
  city: profile.city,
  job: profile.job,
  hobbies: profile.hobbies,
  languages: profile.languages,
  education: profile.education,
}))
