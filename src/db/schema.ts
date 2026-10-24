import { pgTable, serial, text, timestamp, index } from 'drizzle-orm/pg-core';

// Users table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_role').on(table.role),
]);

// Key-value store for application synchronization data
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  data: text('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_site_settings_updated_at').on(table.updatedAt),
]);

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
}, (table) => [
  index('idx_appointments_phone').on(table.phone),
  index('idx_appointments_date').on(table.date),
  index('idx_appointments_status').on(table.status),
  index('idx_appointments_specialist').on(table.specialist),
  index('idx_appointments_date_status').on(table.date, table.status),
  index('idx_appointments_created_at').on(table.createdAt),
]);

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
}, (table) => [
  index('idx_specialists_specialty').on(table.specialty),
  index('idx_specialists_name').on(table.name),
]);

// Medical and rehabilitation services
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  icon: text('icon'),
  price: text('price'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_services_category').on(table.category),
]);
