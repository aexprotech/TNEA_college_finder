  import React, { useState, useEffect } from 'react';
  import Header from './components/Header';
  import Hero from './components/Hero';
  import SearchFilters from './components/SearchFilters';
  import SearchResults from './components/SearchResults';
  import DebugFilters from './components/DebugFilters';
  import Analytics from './components/Analytics';
  import About from './components/About';
  import Footer from './components/Footer';
  import DataManagement from './components/DataManagement';
  import { supabase, CollegeData } from './lib/supabase';
  import WishlistPage from './components/WishlistPage';
  import { firestoreService } from './services/firestore';
  import { DndProvider } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';

  interface SearchFilters {
    cutoff: string;
    category: string;
    locations: string[];  // Array of strings
    courses: string[];    // Array of strings
  }

  interface UserData {
    id: string;
    email: string;
    name: string;
    photo?: string;
    type: 'admin' | 'user';
  }

  interface SmartSearchResult extends CollegeData {
    cutoffDifference: number;
    proximityScore: number;
    matchType: 'Perfect Match' | 'Very Close' | 'Good Option' | 'Consider This';
    locationPriority: 'Selected Districts' | 'Other Districts';
    admissionProbability: number;
    cutoff_mark_2023?: string | number;
    cutoff_mark_2024?: string | number;
  }

  function App() {
    const [userData, setUserData] = useState<UserData | null>(() => {
      const saved = localStorage.getItem('userData');
      return saved ? JSON.parse(saved) : null;
    });

    const [activeSection, setActiveSection] = useState('home');
    const [searchResults, setSearchResults] = useState<SmartSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
      cutoff: '',
      category: '',
      locations: [],
      courses: []
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => 
      localStorage.getItem('isLoggedIn') === 'true'
    );
    const [userType, setUserType] = useState<'admin' | 'user' | null>(() => 
      localStorage.getItem('userType') as 'admin' | 'user' | null
    );

    const handleLogin = (type: 'admin' | 'user', user?: any) => {
      setIsLoggedIn(true);
      setUserType(type);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', type);

      if (user) {
        const userData: UserData = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          photo: user.photoURL || '',
          type: 'user'
        };
        setUserData(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else if (type === 'admin') {
        const adminData: UserData = {
          id: 'admin',
          email: 'admin@example.com',
          name: 'Administrator',
          type: 'admin'
        };
        setUserData(adminData);
        localStorage.setItem('userData', JSON.stringify(adminData));
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      setIsLoggedIn(false);
      setUserType(null);
      setUserData(null);
      setWishlist([]);
    };

    const [wishlist, setWishlist] = useState<SmartSearchResult[]>(() => {
      const saved = localStorage.getItem('collegeWishlist');
      return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
      localStorage.setItem('collegeWishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const [wishlistRefreshTrigger, setWishlistRefreshTrigger] = useState(0);
    useEffect(() => {
      console.log('Current wishlist state:', wishlist);
    }, [wishlist]);
    useEffect(() => {
      const loadWishlist = async () => {
        if (userData?.id) {
          try {
            const items = await firestoreService.getWishlist(userData.id);
            setWishlist(items);
          } catch (error) {
            console.error('Error loading wishlist:', error);
          }
        }
      };
      loadWishlist();
    }, [userData, wishlistRefreshTrigger]);

    const refreshWishlist = () => {
      console.log('Manual wishlist refresh triggered');
      setWishlistRefreshTrigger(prev => prev + 1);
    };
    const handleRemoveFromWishlist = async (college: SmartSearchResult) => {
      if (!userData?.id) return;
      
      console.log('Removing college with ID:', college.id);
      console.log('Current wishlist before removal:', wishlist.map(item => item.id));
    
      try {
        // Remove from Firebase first
        await firestoreService.removeFromWishlist(userData.id, String(college.id));
        
        console.log('Successfully removed from Firebase');
        
        // Then update local state to match Firebase
        setWishlist(prev => prev.filter(item => item.id !== college.id));
        
      } catch (error) {
        // If Firebase fails, show error but don't revert (item wasn't removed)
        console.error('Error removing from wishlist:', error);
        alert('Error removing from wishlist. Please try again.');
      }
    };
    const toggleWishlist = async (college: SmartSearchResult) => {
      if (!userData?.id) {
        alert('Please login to use wishlist');
        return;
      }
    
      try {
        const exists = wishlist.some(item => item.id === college.id);
        
        if (exists) {
          // Remove from Firebase first
          await firestoreService.removeFromWishlist(userData.id, String(college.id));
          // Then update local state
          setWishlist(prev => prev.filter(item => item.id !== college.id));
        } else {
          // Add to Firebase first
          await firestoreService.addToWishlist(userData.id, college);
          // Then update local state
          setWishlist(prev => [...prev, college]);
        }
      } catch (error) {
        console.error('Error updating wishlist:', error);
        alert('Error updating wishlist. Please try again.');
      }
    };

    const getWishlistItems = (): SmartSearchResult[] => {
      const wishlistIds = new Set(wishlist.map(item => String(item.id)));
      return searchResults.filter(college => wishlistIds.has(String(college.id)));
    };

    const handleStartSearch = () => {
      setActiveSection('search');
    };
    const handleSearch = async () => {
      if (!filters.cutoff || !filters.category) {
        alert('Please enter your cutoff marks and select a category');
        return;
      }
    
      const userCutoff = parseFloat(filters.cutoff);
      if (userCutoff < 0 || userCutoff > 200) {
        alert('Please enter cutoff marks between 0-200');
        return;
      }
    
      setIsSearching(true);
      setHasSearched(true);
      
      try {
        console.log('=== SEARCH ALGORITHM ===');
        console.log('🎯 User Input:');
        console.log(`   Cutoff: ${userCutoff}`);
        console.log(`   Category: "${filters.category}"`);
        console.log(`   Courses: ${filters.courses?.join(', ') || 'All courses'}`);
        console.log(`   Districts: ${filters.locations?.join(', ') || 'All districts'}`);
    
        const parseCutoffValue = (value: any): number => {
          if (value === null || value === undefined) return 0;
          if (typeof value === 'number') return value;
          const num = parseFloat(value);
          return isNaN(num) ? 0 : num;
        };
    
        const calculateProximityData = (records: CollegeData[], locationPriority: 'Selected Districts' | 'Other Districts') => {
          return records.map(record => {
            const cutoff2023 = parseCutoffValue(record.cutoff_mark_2023);
            const cutoff2024 = parseCutoffValue(record.cutoff_mark_2024);
            const recordCutoff = cutoff2024 || cutoff2023;
            const cutoffDifference = Math.abs(recordCutoff - userCutoff);
            
            let proximityScore = 0;
            if (recordCutoff > 0) {
              proximityScore = userCutoff >= recordCutoff
                ? 100 - ((userCutoff - recordCutoff) * 2)
                : Math.max(0, 70 - ((recordCutoff - userCutoff) * 5));
            }
    
            let admissionProbability = 0;
            let matchType: 'Perfect Match' | 'Very Close' | 'Good Option' | 'Consider This';
            
            if (recordCutoff === 0) {
              matchType = 'Consider This';
              admissionProbability = 50;
            } else if (userCutoff >= recordCutoff) {
              if (userCutoff - recordCutoff <= 2) {
                matchType = 'Perfect Match';
                admissionProbability = 99;
              } else if (userCutoff - recordCutoff <= 5) {
                matchType = 'Very Close';
                admissionProbability = 95;
              } else if (userCutoff - recordCutoff <= 10) {
                matchType = 'Good Option';
                admissionProbability = 85;
              } else {
                matchType = 'Good Option';
                admissionProbability = 80;
              }
            } else {
              const difference = recordCutoff - userCutoff;
              if (difference <= 2) {
                matchType = 'Very Close';
                admissionProbability = 75;
              } else if (difference <= 5) {
                matchType = 'Good Option';
                admissionProbability = 60;
              } else if (difference <= 10) {
                matchType = 'Consider This';
                admissionProbability = 40;
              } else {
                matchType = 'Consider This';
                admissionProbability = Math.max(10, 30 - difference);
              }
            }
    
            return {
              ...record,
              cutoffDifference,
              proximityScore,
              matchType,
              locationPriority,
              admissionProbability,
              cutoff_mark_2023: record.cutoff_mark_2023,
              cutoff_mark_2024: record.cutoff_mark_2024,
              cutoffTrend: cutoff2023 && cutoff2024 
                ? cutoff2024 > cutoff2023 ? 'up' : cutoff2024 < cutoff2023 ? 'down' : 'stable'
                : undefined
            } as SmartSearchResult;
          });
        };
    
        const tableName = 'college_records';
        let allResults: SmartSearchResult[] = [];
    
        // Case 1: Specific courses selected
        if (filters.courses?.length > 0) {
          for (const course of filters.courses) {
            let query = supabase
              .from(tableName)
              .select('*')
              .eq('branch_name', course)
              .eq('category', filters.category);
    
            if (filters.locations?.length > 0) {
              query = query.in('district', filters.locations);
            }
    
            const { data: courseData, error: courseError } = await query;
    
            if (courseError) throw courseError;
            if (!courseData?.length) continue;
    
            const results = calculateProximityData(
              courseData,
              filters.locations?.length > 0 ? 'Selected Districts' : 'Other Districts'
            );
            allResults = [...allResults, ...results];
          }
        } 
        // Case 2: No courses selected, but districts selected
        else if (filters.locations?.length > 0) {
          let query = supabase
            .from(tableName)
            .select('*')
            .eq('category', filters.category)
            .in('district', filters.locations);
    
          const { data: districtData, error: districtError } = await query;
          if (districtError) throw districtError;
    
          if (districtData?.length) {
            const results = calculateProximityData(districtData, 'Selected Districts');
            allResults = [...results];
          }
        } 
        // Case 3: Neither courses nor districts selected
        else {
          let query = supabase
            .from(tableName)
            .select('*')
            .eq('category', filters.category);
    
          const { data: allData, error: allError } = await query;
          if (allError) throw allError;
    
          if (allData?.length) {
            const results = calculateProximityData(allData, 'Other Districts');
            allResults = [...results];
          }
        }
    
        // Final sorting
        const finalResults = allResults.sort((a, b) => {
          if (a.locationPriority !== b.locationPriority) {
            return a.locationPriority === 'Selected Districts' ? -1 : 1;
          }
          
          const matchTypePriority = {
            'Perfect Match': 0,
            'Very Close': 1,
            'Good Option': 2,
            'Consider This': 3,
          };
          
          const aPriority = matchTypePriority[a.matchType];
          const bPriority = matchTypePriority[b.matchType];
          
          if (aPriority !== bPriority) return aPriority - bPriority;
          if (a.admissionProbability !== b.admissionProbability) {
            return b.admissionProbability - a.admissionProbability;
          }
          
          return a.cutoffDifference - b.cutoffDifference;
        });
    
        console.log(`✅ Found ${finalResults.length} results`);
        setSearchResults(finalResults);
    
      } catch (error) {
        console.error('Search error:', error);
        alert(`Search failed: ${error instanceof Error ? error.message : error}`);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    const handleReset = () => {
      setFilters({
        cutoff: '',
        category: '',
        locations: [],
        courses: []
      });
      setSearchResults([]);
      setHasSearched(false);
    };

    useEffect(() => {
      const titles = {
        home: 'CollegeFinder - Find Your Perfect Engineering College in Tamil Nadu',
        search: 'Search Engineering Colleges - CollegeFinder',
        debug: 'Debug Filters - CollegeFinder',
        analytics: 'Engineering Education Analytics - CollegeFinder',
        about: 'About CollegeFinder - Tamil Nadu Engineering Colleges',
        manage: 'Database Management - CollegeFinder'
      };
      document.title = titles[activeSection as keyof typeof titles] || titles.home;
    }, [activeSection]);

    const renderContent = () => {
      if (!isLoggedIn && activeSection === 'wishlist') {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Please Login</h2>
              <p className="mt-2 text-gray-600">You need to be logged in to view your wishlist.</p>
            </div>
          </div>
        );
      }

      if (userType !== 'admin' && ['debug', 'manage', 'analytics'].includes(activeSection)) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
              <p className="mt-2 text-gray-600">You need admin privileges to access this section.</p>
            </div>
          </div>
        );
      }

      switch (activeSection) {
        case 'wishlist':
          return (
            <DndProvider backend={HTML5Backend}>
              <WishlistPage 
                wishlistItems={wishlist}
                removeFromWishlist={handleRemoveFromWishlist}
                userId={userData?.id || ''}
                refreshWishlist={refreshWishlist}
              />
            </DndProvider>
          );
        case 'search':
          return (
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Find Your Perfect Engineering College
                  </h1>
                  <p className="text-xl text-gray-600">
                    Location-prioritized search with smart cutoff proximity
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-gray-700">
                      🎯 <strong>New Algorithm:</strong> Course → Category → Location Priority → Cutoff Proximity
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      📍 Selected district colleges appear first, then other districts (both sorted by cutoff closeness)
                    </p>
                  </div>
                </div>

                <SearchFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
                
                {hasSearched && (
                  <SearchResults 
                    results={searchResults} 
                    isLoading={isSearching}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />
                )}
              </div>
            </div>
          );
        case 'debug':
          return <DebugFilters />;
        case 'analytics':
          return <Analytics />;
        case 'about':
          return <About />;
        case 'manage':
          return (
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Database Management
                  </h1>
                  <p className="text-xl text-gray-600">
                    Clean database and prepare for fresh CSV upload
                  </p>
                </div>
                <DataManagement />
              </div>
            </div>
          );
        default:
          return (
            <div>
              <Hero onStartSearch={handleStartSearch} />
              <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Real College Data at Your Fingertips
                    </h2>
                    <p className="text-xl text-gray-600">
                      Get instant, personalized college recommendations based on your cutoff marks
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={handleStartSearch}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                      Start Searching Colleges
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          isLoggedIn={isLoggedIn}
          userType={userType}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />
        <main className="flex-1">
          {renderContent()}
        </main>
        <Footer />
      </div>
    );
  }

  export default App;