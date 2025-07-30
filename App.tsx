
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StatCard, StatCardProps } from './components/StatCard';
import { BottomNav } from './components/BottomNav';
import { 
  BusinessType, ActiveTab, Message, HeatmapDataPoint, 
  Booking, Employee, NavItem, BookingType, EmployeeDepartment, EmployeeStatus, HeatmapBookingDetail
} from './types';
import { 
  ArrowUpRightIcon, AcademicCapIcon, BriefcaseIcon, UserSolidIcon, ChartBarIcon, 
  CalendarDaysIcon, CogIcon, UsersIcon, DocumentTextIcon, MagnifyingGlassIcon, BellIcon,
  BuildingStorefrontIcon, IdentificationIcon, CalendarPlusIcon, ChartPieIcon
} from './components/icons/IconComponents';
import { RealTimeClock } from './components/RealTimeClock';
import { FloatingActionButton } from './components/FloatingActionButton';

// Tab Components
import { OverviewTab } from './components/tabs/OverviewTab';
import { BookingsTab } from './components/tabs/BookingsTab';
import { EmployeesTab } from './components/tabs/EmployeesTab';
import { ReportsTab } from './components/tabs/ReportsTab'; // Added ReportsTab
import { AddBookingTab } from './components/tabs/AddBookingTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { CustomersTab } from './components/tabs/CustomersTab';

// Helper function for parsing slot start hour
const getSlotStartHour = (hourString: string): number => {
  const hNum = parseInt(hourString.replace('am', '').replace('pm', ''));
  if (hourString.toLowerCase().includes('pm')) {
    return hNum === 12 ? 12 : hNum + 12; // 12pm is 12, 1pm is 13
  } else { // am
    return hNum === 12 ? 0 : hNum; // 12am is 0, 1am is 1
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Overview);
  const [userName] = useState<string>('Sir, Divyanshu');
  
  // Main Data States - Initialize empty, will be populated from localStorage or seed
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to manage initial load

  const [messages] = useState<Message[]>([ 
    { id: '1', sender: 'Theresa Webb', avatarUrl: `https://picsum.photos/seed/theresa/40/40`, preview: "Hi Robert, I'd like to invite you on our team", timestamp: '3 min ago', isRead: false },
    { id: '2', sender: 'John Doe', avatarUrl: `https://picsum.photos/seed/john/40/40`, preview: 'Can we reschedule our tent setup for Saturday?', timestamp: '1 hr ago', isRead: true },
    { id: '3', sender: 'Jane Smith', avatarUrl: `https://picsum.photos/seed/jane/40/40`, preview: 'Invoice #INV002 payment confirmation.', timestamp: '5 hr ago', isRead: true },
  ]);

  // UI State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bookingFilterType, setBookingFilterType] = useState<BusinessType | null>(null);

  // Stats State
  const initialStatsValues = {
    tentsValue: 0, tentsChange: 0,
    cateringValue: 0, cateringChange: 0,
    combinedValue: 0, combinedChange: 0,
  };
  const [statValues, setStatValues] = useState(initialStatsValues);
  
  const appStats: Record<string, StatCardProps['data']> = useMemo(() => ({
    tents: { value: statValues.tentsValue, change: statValues.tentsChange, title: 'Tent Bookings Value', type: BusinessType.Tents, icon: <AcademicCapIcon /> },
    catering: { value: statValues.cateringValue, change: statValues.cateringChange, title: 'Catering Orders Value', type: BusinessType.Catering, icon: <UserSolidIcon /> },
    combined: { value: statValues.combinedValue, change: statValues.combinedChange, title: 'Total Bookings Value', type: BusinessType.Combined, icon: <BriefcaseIcon />, highlight: true },
  }), [statValues]);


  // --- Data Initialization & Loading from localStorage ---
  useEffect(() => {
    const currentDateForSeed = new Date(); // Used if no localStorage data

    // --- Load Bookings ---
    const seedBookings: Booking[] = [
      { id: 'b1', title: 'Wedding Tent Setup', eventType: 'Wedding', type: BusinessType.Tents, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth(), currentDateForSeed.getDate() + 2, 10), status: 'confirmed', customerName: 'Priya Sharma', amount: 120000, venue: 'Taj Falaknuma Palace, Hyderabad', customerEmail: 'priya.s@example.com', customerPhone: '9876543210' },
      { id: 'b2', title: 'Corporate Catering', eventType: 'Corporate Event', type: BusinessType.Catering, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth(), currentDateForSeed.getDate() + 3, 13), status: 'pending', customerName: 'Rohan Kumar', amount: 85000, venue: 'ITC Grand Bharat, Gurugram', customerCompany: 'ABC Corp'  },
      { id: 'b3', title: 'Birthday Party Tents', eventType: 'Birthday Party', type: BusinessType.Tents, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth(), currentDateForSeed.getDate(), 14), status: 'confirmed', customerName: 'Ananya Reddy', amount: 75000, venue: 'Community Hall, Sector 15', guestCount: 100  },
      { id: 'b4', title: 'Anniversary Catering', eventType: 'Anniversary', type: BusinessType.Catering, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth() -1, currentDateForSeed.getDate(), 0), status: 'confirmed', customerName: 'Vikram Singh', amount: 150000, venue: 'The Oberoi Udaivilas, Udaipur', referralSource: 'Word of Mouth' }, 
      { id: 'b5', title: 'Conference Setup', eventType: 'Conference', type: BusinessType.Tents, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth()-2, currentDateForSeed.getDate() + 1, 23), status: 'confirmed', customerName: 'Meera Patel', amount: 250000, venue: 'JW Marriott, Aerocity', customerEmail: 'meera.p@example.net' },
      { id: 'b6', title: 'Gala Dinner Catering', eventType: 'Gala Dinner', type: BusinessType.Catering, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth()-1, currentDateForSeed.getDate() + 1, 2), status: 'pending', customerName: 'Arjun Desai', amount: 320000, venue: 'Leela Palace, New Delhi' },
      { id: 'b7', title: 'Evening Event Tents', eventType: 'Social Gathering', type: BusinessType.Tents, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth(), currentDateForSeed.getDate(), 19), status: 'confirmed', customerName: 'Sneha Rao', amount: 95000, venue: 'Neemrana Fort-Palace, Alwar'  },
      { id: 'b8', title: 'Music Fest Tents', eventType: 'Festival', type: BusinessType.Tents, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth() - 3, 15, 10), status: 'confirmed', customerName: 'Aditya Mehta', amount: 220000, venue: 'Red Fort Lawns, Delhi' },
      { id: 'b9', title: 'Book Launch Catering', eventType: 'Book Launch', type: BusinessType.Catering, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth() - 4, 5, 18), status: 'confirmed', customerName: 'Ishaan Chatterjee', amount: 180000, venue: 'Umaid Bhawan Palace, Jodhpur' },
      { id: 'b10', title: 'Sangeet Ceremony Setup', eventType: 'Wedding Function', type: BusinessType.Tents, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth(), currentDateForSeed.getDate() + 5, 18), status: 'pending', customerName: 'Priya Sharma', amount: 90000, venue: 'Sharma Farms, Chattarpur' }, // Same customer as b1
      { id: 'b11', title: 'Office Lunch Catering', eventType: 'Corporate Lunch', type: BusinessType.Catering, date: new Date(currentDateForSeed.getFullYear(), currentDateForSeed.getMonth(), currentDateForSeed.getDate() + 1, 12), status: 'confirmed', customerName: 'Rohan Kumar', amount: 45000, venue: 'Tech Park, Building A' }, // Same customer as b2
    ];
    
    try {
      const storedBookingsRaw = localStorage.getItem('dashboardBookings');
      if (storedBookingsRaw) {
        const parsedBookings = JSON.parse(storedBookingsRaw).map((b: any) => ({
          ...b,
          date: new Date(b.date), // Re-hydrate date strings to Date objects
        }));
        setBookings(parsedBookings);
      } else {
        setBookings(seedBookings);
      }
    } catch (error) {
      console.error("Error loading bookings from localStorage, using seed data:", error);
      setBookings(seedBookings);
    }

    // --- Load Employees ---
    const seedEmployees: Employee[] = [
      { id: 'e1', name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/johns/80/80', department: BusinessType.Tents, role: 'Tent Lead', status: 'Present', checkInTime: '08:55 AM', email: 'j.smith@example.com', phone: '555-0101' },
      { id: 'e2', name: 'Maria Garcia', avatarUrl: 'https://picsum.photos/seed/mariag/80/80', department: BusinessType.Catering, role: 'Catering Manager', status: 'Late', checkInTime: '09:15 AM', email: 'm.garcia@example.com', phone: '555-0102'  },
      { id: 'e3', name: 'David Wilson', avatarUrl: 'https://picsum.photos/seed/davidw/80/80', department: BusinessType.Tents, role: 'Setup Assistant', status: 'Absent', email: 'd.wilson@example.com', phone: '555-0103' },
      { id: 'e4', name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/priyas/80/80', department: 'Management', role: 'Operations Head', status: 'Present', checkInTime: '09:00 AM', email: 'p.sharma@example.com', phone: '555-0104' },
      { id: 'e5', name: 'Ken Adams', avatarUrl: 'https://picsum.photos/seed/kena/80/80', department: BusinessType.Catering, role: 'Chef', status: 'On Leave', email: 'k.adams@example.com', phone: '555-0105' },
    ];

    try {
      const storedEmployeesRaw = localStorage.getItem('dashboardEmployees');
      if (storedEmployeesRaw) {
        setEmployees(JSON.parse(storedEmployeesRaw));
      } else {
        setEmployees(seedEmployees);
      }
    } catch (error) {
      console.error("Error loading employees from localStorage, using seed data:", error);
      setEmployees(seedEmployees);
    }
    setIsDataLoaded(true); 
  }, []); 


  // --- Save data to localStorage whenever it changes ---
  useEffect(() => {
    if (isDataLoaded) { 
      localStorage.setItem('dashboardBookings', JSON.stringify(bookings));
    }
  }, [bookings, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('dashboardEmployees', JSON.stringify(employees));
    }
  }, [employees, isDataLoaded]);
  

  // Update stats whenever bookings change
  useEffect(() => {
    if (bookings.length === 0 && !isDataLoaded) return; 

    const tentsTotal = bookings
      .filter((b: Booking) => b.type === BusinessType.Tents)
      .reduce((sum: number, b: Booking) => sum + b.amount, 0);
    const cateringTotal = bookings
      .filter((b: Booking) => b.type === BusinessType.Catering)
      .reduce((sum: number, b: Booking) => sum + b.amount, 0);
    
    const newTentsChange = parseFloat(((Math.random() - 0.4) * 15).toFixed(1)); 
    const newCateringChange = parseFloat(((Math.random() - 0.4) * 10).toFixed(1));
    const newCombinedChange = parseFloat(((newTentsChange + newCateringChange) / 2 + (Math.random() - 0.5) * 5).toFixed(1));

    setStatValues({
      tentsValue: tentsTotal,
      tentsChange: newTentsChange,
      cateringValue: cateringTotal,
      cateringChange: newCateringChange,
      combinedValue: tentsTotal + cateringTotal,
      combinedChange: newCombinedChange,
    });
  }, [bookings, isDataLoaded]);


  // --- Booking Management ---
  const handleAddBooking = useCallback((newBookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: newBookingData.title,
      customerName: newBookingData.customerName,
      customerEmail: newBookingData.customerEmail,
      customerPhone: newBookingData.customerPhone,
      customerCompany: newBookingData.customerCompany,
      customerAddress: newBookingData.customerAddress,
      eventType: newBookingData.eventType,
      venue: newBookingData.venue,
      date: newBookingData.date,
      guestCount: newBookingData.guestCount,
      type: newBookingData.type,
      amount: newBookingData.amount,
      referralSource: newBookingData.referralSource,
      status: newBookingData.status,
      notes: newBookingData.notes,
    };
    setBookings((prevBookings: Booking[]) => [...prevBookings, newBooking].sort((a: Booking, b: Booking) => b.date.getTime() - a.date.getTime()));
    setActiveTab(ActiveTab.Bookings); 
    setBookingFilterType(newBookingData.type); 
    setSearchTerm(""); 
  }, []);
  
  const handleStatCardNavigation = useCallback((businessType: BusinessType | null) => {
    setActiveTab(ActiveTab.Bookings);
    setBookingFilterType(businessType);
    setSearchTerm("");
  }, []);

  const handleUpdateBookingStatus = useCallback((bookingId: string, newStatus: 'confirmed' | 'pending') => {
    setBookings((prevBookings: Booking[]) => 
      prevBookings.map((booking: Booking) => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  }, []);

  const handleDeleteBooking = (bookingIdToDelete: string) => {
    setBookings((currentBookings: Booking[]) => {
      const indexToDelete = currentBookings.findIndex((booking: Booking) => booking.id === bookingIdToDelete);
      
      if (indexToDelete > -1) {
        const updatedBookings = [
          ...currentBookings.slice(0, indexToDelete),
          ...currentBookings.slice(indexToDelete + 1)
        ];
        return updatedBookings;
      }
      return currentBookings; 
    });
  };

  // --- Employee Management ---
  const handleAddEmployee = useCallback((newEmployeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...newEmployeeData,
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      avatarUrl: newEmployeeData.avatarUrl || `https://picsum.photos/seed/${newEmployeeData.name.split(' ').join('')}/80/80`, // Default avatar
    };
    setEmployees((prevEmployees: Employee[]) => [...prevEmployees, newEmployee].sort((a: Employee, b: Employee) => a.name.localeCompare(b.name)));
  }, []);

  const handleUpdateEmployee = useCallback((updatedEmployee: Employee) => {
    setEmployees((prevEmployees: Employee[]) => 
      prevEmployees.map((emp: Employee) => 
        emp.id === updatedEmployee.id ? { ...emp, ...updatedEmployee } : emp
      )
    );
  }, []);

  const handleDeleteEmployee = useCallback((employeeId: string) => {
    setEmployees((prevEmployees: Employee[]) => prevEmployees.filter((emp: Employee) => emp.id !== employeeId));
  }, []);

  const handleUpdateEmployeeStatus = useCallback((employeeId: string, newStatus: EmployeeStatus, checkInTime?: string) => {
    setEmployees((prevEmployees: Employee[]) =>
      prevEmployees.map((emp: Employee) =>
        emp.id === employeeId
          ? {
              ...emp,
              status: newStatus,
              checkInTime: (newStatus === 'Present' || newStatus === 'Late') ? checkInTime || emp.checkInTime : undefined,
            }
          : emp
      )
    );
  }, []);


  // --- Heatmap Data Processing ---
  const heatmapHours = useMemo(() => [
    '2pm', '4pm', '6pm', '8pm', '10pm', '12am', '2am'
  ],[]);
  const heatmapDays = useMemo(() => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],[]);
  const currentDateForHeatmap = useMemo(() => new Date(), []); // Use a stable current date for heatmap logic

  const formattedHeatmapData: HeatmapDataPoint[][] = useMemo(() => {
    if (!isDataLoaded) return heatmapHours.map(hour => heatmapDays.map(day => ({ day, timeSlot: hour, bookings: 0, totalRevenue: 0, tentRevenue: 0, cateringRevenue: 0, bookingDetails: [] })));
    
    const dataGrid: HeatmapDataPoint[][] = heatmapHours.map((hour: string) =>
      heatmapDays.map((day: string) => ({ day, timeSlot: hour, bookings: 0, totalRevenue: 0, tentRevenue: 0, cateringRevenue: 0, bookingDetails: [] }))
    );

    bookings.forEach((booking: Booking) => {
      const bookingDay = heatmapDays[booking.date.getDay()];
      const bookingHour24 = booking.date.getHours(); 
      
      const hourString = heatmapHours.find((slotStr: string) => {
        const slotStartHour = getSlotStartHour(slotStr);
        return bookingHour24 >= slotStartHour && bookingHour24 < slotStartHour + 2;
      });

      if (bookingDay && hourString) {
        const hourIndex = heatmapHours.indexOf(hourString);
        const dayIndex = heatmapDays.indexOf(bookingDay);

        if (hourIndex !== -1 && dayIndex !== -1) { 
          const cell = dataGrid[hourIndex][dayIndex];
          cell.bookings += 1;
          cell.totalRevenue += booking.amount;

          if (booking.type === BusinessType.Tents) {
            cell.tentRevenue += booking.amount;
          } else if (booking.type === BusinessType.Catering) {
            cell.cateringRevenue += booking.amount;
          }
          
          const bookingDetail: HeatmapBookingDetail = {
            id: booking.id,
            title: booking.title,
            customerName: booking.customerName,
            amount: booking.amount,
            time: booking.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: booking.type,
            venue: booking.venue, 
          };
          cell.bookingDetails.push(bookingDetail);
        }
      }
    });
    return dataGrid;
  }, [bookings, heatmapDays, heatmapHours, isDataLoaded]);
  
  const todayHeatmapHighlight = useMemo(() => {
      const dayStr = heatmapDays[currentDateForHeatmap.getDay()];
      const currentHour24 = currentDateForHeatmap.getHours();
      
      const hourStr = heatmapHours.find((slotStr: string) => {
        const slotStartHour = getSlotStartHour(slotStr);
        return currentHour24 >= slotStartHour && currentHour24 < slotStartHour + 2;
      });
      return { day: dayStr, hour: hourStr };
  }, [currentDateForHeatmap, heatmapDays, heatmapHours]);


  // --- Navigation Items ---
  const navItems: NavItem[] = useMemo(() => [
    { id: ActiveTab.Overview, label: ActiveTab.Overview, icon: <ChartBarIcon /> },
    { id: ActiveTab.Bookings, label: ActiveTab.Bookings, icon: <CalendarDaysIcon /> },
    { id: ActiveTab.Employees, label: ActiveTab.Employees, icon: <IdentificationIcon /> },
    { id: ActiveTab.Analytics, label: ActiveTab.Analytics, icon: <ChartPieIcon /> },
    { id: ActiveTab.Customers, label: ActiveTab.Customers, icon: <UsersIcon /> },
    { id: ActiveTab.Reports, label: ActiveTab.Reports, icon: <DocumentTextIcon /> },
  ],[]);

  const handleFabClick = () => {
    setActiveTab(ActiveTab.NewBooking);
  };


  // --- Render Active Tab Content ---
  const renderActiveTabContent = () => {
    if (!isDataLoaded) {
      return (
        <div className="p-6 text-center flex flex-col items-center justify-center h-full">
          <CogIcon className="w-16 h-16 text-brand-purple animate-spin mb-4" />
          <p className="text-xl text-light-text">Loading Dashboard Data...</p>
        </div>
      );
    }

    const commonTabProps = { searchTerm };
    switch (activeTab) {
      case ActiveTab.Overview:
        return <OverviewTab 
                  userName={userName}
                  bookings={bookings} 
                  heatmapDays={heatmapDays}
                  heatmapHours={heatmapHours}
                  heatmapData={formattedHeatmapData}
                  todayHighlight={todayHeatmapHighlight}
                  messages={messages.slice(0,3)} 
                  searchTerm={searchTerm}
                  currentDateForTitle={currentDateForHeatmap}
                />;
      case ActiveTab.Bookings:
        return <BookingsTab 
                  bookings={bookings} 
                  {...commonTabProps} 
                  activeFilter={bookingFilterType}
                  setActiveFilter={setBookingFilterType}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onDeleteBooking={handleDeleteBooking}
                />;
      case ActiveTab.NewBooking:
        return <AddBookingTab onAddBooking={handleAddBooking} />;
      case ActiveTab.Employees:
        return <EmployeesTab 
                  employees={employees} 
                  {...commonTabProps} 
                  onAddEmployee={handleAddEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
                />;
      case ActiveTab.Analytics:
        return <AnalyticsTab bookings={bookings} employees={employees} searchTerm={searchTerm} />;
      case ActiveTab.Customers:
         return <CustomersTab bookings={bookings} searchTerm={searchTerm} />;
      case ActiveTab.Reports:
        return <ReportsTab searchTerm={searchTerm} />;
      default:
        return <div className="p-6 text-center">Unknown Tab. Please select a valid option.</div>;
    }
  };
  
  const handleNavigateToOverview = () => {
    setActiveTab(ActiveTab.Overview);
    setBookingFilterType(null); 
    setSearchTerm(""); 
  };

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-dark-bg text-light-text px-3 sm:px-5 md:px-8 pt-3 sm:pt-5 md:pt-8 flex flex-col relative">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <aside className="lg:col-span-3 space-y-5 md:space-y-7 flex flex-col">
          <button 
            onClick={handleNavigateToOverview}
            className="group bg-brand-purple text-white rounded-xl px-4 py-3 flex items-center space-x-2 shadow-lg cursor-pointer hover:bg-brand-purple-light hover:shadow-violet-500/40 transform hover:scale-[1.03] transition-all duration-200 w-full text-left p-1 -m-1"
            aria-label="Go to Dashboard Overview"
          >
            <BuildingStorefrontIcon className="w-8 h-8 flex-shrink-0 group-hover:rotate-[3deg] group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold text-lg">Dashboard</span>
          </button>
          {isDataLoaded && (
            <>
              <StatCard data={appStats.tents} arrowIcon={<ArrowUpRightIcon />} onNavigate={handleStatCardNavigation} />
              <StatCard data={appStats.catering} arrowIcon={<ArrowUpRightIcon />} onNavigate={handleStatCardNavigation} />
              <StatCard data={appStats.combined} arrowIcon={<ArrowUpRightIcon />} onNavigate={handleStatCardNavigation} />
            </>
          )}
          {!isDataLoaded && Array(3).fill(0).map((_, idx) => ( // Placeholder StatCards
             <div key={idx} className="bg-dark-card p-6 rounded-2xl shadow-lg min-h-[180px] animate-pulse">
                <div className="h-8 w-8 bg-zinc-700 rounded-full mb-3"></div>
                <div className="h-4 w-3/4 bg-zinc-700 rounded mb-2"></div>
                <div className="h-8 w-1/2 bg-zinc-700 rounded mb-2"></div>
                <div className="h-3 w-1/3 bg-zinc-700 rounded"></div>
             </div>
          ))}
          <div className="mt-auto hidden lg:block"> 
            <RealTimeClock />
          </div>
        </aside>

        <main className="lg:col-span-9 flex flex-col">
           <div 
            key={activeTab.toString()} 
            className="animate-fadeInUp flex-grow bg-dark-bg rounded-xl overflow-y-auto min-h-0 pb-32 lg:pb-20 relative"
           >
            {renderActiveTabContent()}
          </div>
        </main>
      </div>
      
      {activeTab !== ActiveTab.NewBooking && isDataLoaded && (
         <FloatingActionButton 
            onClick={handleFabClick}
            icon={<CalendarPlusIcon className="w-7 h-7" />}
            ariaLabel="Add new booking"
        />
      )}


      <footer className="mt-6 md:mt-8 sticky bottom-3 sm:bottom-5 z-40"> 
        <BottomNav 
          items={navItems} 
          activeTab={activeTab} 
          onTabChange={(tab: ActiveTab) => { setActiveTab(tab); if (tab !== ActiveTab.Bookings) setBookingFilterType(null); }} 
          userAvatarUrl={`https://picsum.photos/seed/${userName.split(',')[0]}/40/40`} 
          searchIcon={<MagnifyingGlassIcon />}
          notificationIcon={<BellIcon />}
          onSearchChange={setSearchTerm}
          currentSearchTerm={searchTerm}
        />
      </footer>
      <div className="mt-4 lg:hidden text-center"> 
          <RealTimeClock />
      </div>
    </div>
  );
};

export default App;