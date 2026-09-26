import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Key-value store for application synchronization data
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  data: text('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Appointments table for clinic bookings
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  phone: text('phone').notNull(),
  specialist: text('specialist'),
  service: text('service'),
  date: text('date').notNull(),
  time: text('time').notNull(),
  status: text('status').default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Medical specialists / consultants
export const specialists = pgTable('specialists', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  specialty: text('specialty').notNull(),
  image: text('image'),
  bio: text('bio'),
  experience: text('experience'),
  rating: text('rating'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Medical and rehabilitation services
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  icon: text('icon'),
  price: text('price'),
  createdAt: timestamp('created_at').defaultNow(),
});
