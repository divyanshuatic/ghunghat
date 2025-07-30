
import { ReactElement } from 'react';
import { IconProps } from './components/icons/IconComponents';

export enum BusinessType {
  Tents = 'Ghunghat Tents',
  Catering = 'Krishna Caterers',
  Combined = 'Combined Services',
}

export interface StatValue {
  value: number;
  change: number; // percentage
  title: string;
  type: BusinessType | null; 
  icon: ReactElement<IconProps>;
  highlight?: boolean;
}

export interface RevenueDataPoint {
  month: string; // e.g., "Jan", "Feb"
  revenue: number;
}

export interface HeatmapBookingDetail {
  id: string;
  title: string;
  customerName: string;
  amount: number;
  time: string; 
  type: BookingType;
  venue: string; // Added venue
}

export interface HeatmapDataPoint {
  day: string; 
  timeSlot: string; 
  bookings: number; 
  totalRevenue: number; 
  tentRevenue: number;
  cateringRevenue: number;
  bookingDetails: HeatmapBookingDetail[];
}

export interface Message {
  id: string;
  sender: string;
  avatarUrl: string;
  preview: string;
  timestamp: string;
  isRead?: boolean;
}

export enum ActiveTab {
  Overview = 'Overview',
  Bookings = 'Bookings',
  NewBooking = 'New Booking',
  Employees = 'Employees',
  Analytics = 'Analytics',
  Customers = 'Customers',
  Reports = 'Reports',
}

export interface NavItem {
  id: ActiveTab;
  label: string;
  icon: ReactElement<IconProps>;
  badge?: number | string;
}

export type BookingType = BusinessType.Tents | BusinessType.Catering;

export interface Booking {
  id: string;
  title: string; // Event Name / Purpose
  type: BookingType;
  date: Date;
  status: 'confirmed' | 'pending';
  customerName: string;
  amount: number; 
  venue: string;
  notes?: string;
  // New detailed fields
  customerEmail?: string;
  customerPhone?: string;
  customerCompany?: string;
  customerAddress?: string;
  eventType: string; // e.g., Wedding, Birthday, Corporate - Made required
  guestCount?: number;
  referralSource?: string;
}

export type EmployeeStatus = 'Present' | 'Absent' | 'Late' | 'On Leave';
export type EmployeeDepartment = BusinessType.Tents | BusinessType.Catering | 'Management';


export interface Employee {
  id: string;
  name: string;
  avatarUrl: string;
  department: EmployeeDepartment;
  role: string; // Added role
  status: EmployeeStatus;
  checkInTime?: string; 
  email: string;
  phone: string;
}
