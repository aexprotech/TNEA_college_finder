import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RotateCcw, AlertCircle, CheckCircle, Database, Bug, Brain, TestTube, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ChevronDown } from 'lucide-react';

interface SearchFiltersType {
  cutoff: string;
  category: string;
  locations: string[];
  courses: string[];
}

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSearch: () => void;
  onReset: () => void;
  isAdmin: boolean;
}

// Sorted alphabetically
const PREDEFINED_CATEGORIES = ['BCM', 'MBC', 'OC', 'SCA', 'SC', 'BC', 'ST'].sort();

const PREDEFINED_DISTRICTS = [
  'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 
  'Dindigul', 'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 
  'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Salem', 'Sivaganga',
  'Thanjavur', 'Theni', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur',
  'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Tuticorin', 'Vellore',
  'Villupuram', 'Virudhunagar', 'Not Found'
].sort((a, b) => a.localeCompare(b));

const PREDEFINED_COURSES = [
  'AERONAUTICAL ENGINEERING', 'AEROSPACE ENGINEERING', 'AGRICULTURAL ENGINEERING', 
  'APPAREL TECHNOLOGY (SS)', 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE', 
  'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE (SS)', 'AUTOMOBILE ENGINEERING', 
  'AUTOMOBILE ENGINEERING (SS)', 'Artificial Intelligence and Data Science', 
  'Artificial Intelligence and Machine Learning', 'B.Plan', 'BIO MEDICAL ENGINEERING', 
  'BIO MEDICAL ENGINEERING  (SS)', 'BIO TECHNOLOGY', 'BIO TECHNOLOGY (SS)', 
  'Bachelor of Design', 'Bio Technology and Bio Chemical Engineering', 
  'CERAMIC TECHNOLOGY (SS)', 'CHEMICAL  ENGINEERING', 'CHEMICAL  ENGINEERING (SS)', 
  'CHEMICAL AND ELECTRO CHEMICAL  ENGINEERING (SS)', 'CIVIL  ENGINEERING', 
  'CIVIL  ENGINEERING (SS)', 'CIVIL AND STRUCTUTRAL ENGINEERING', 
  'CIVIL ENGINEERING (TAMIL MEDIUM)', 'COMPUTER AND  COMMUNICATION ENGINEERING', 
  'COMPUTER SCIENCE AND BUSSINESS SYSTEM', 'COMPUTER SCIENCE AND DESIGN', 
  'COMPUTER SCIENCE AND ENGINEERING', 'COMPUTER SCIENCE AND ENGINEERING (AI AND MACHINE LEARNING)', 
  'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', 
  'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)', 'COMPUTER SCIENCE AND ENGINEERING (SS)', 
  'COMPUTER SCIENCE AND ENGINEERING (TAMIL)', 'COMPUTER TECHNOLOGY', 
  'Civil Engineering (Environmental Engineering)', 'Computer Science and Business System (SS)', 
  'Computer Science and Engineering (Artificial Intelligence and Machine Learning) (SS)', 
  'Computer Science and Engineering (Cyber Security)', 
  'Computer Science and Engineering (Internet of Things and Cyber Security including Block Chain Technology)', 
  'Computer Science and Engineering (Internet of Things)', 'Computer Science and Technology', 
  'Cyber Security', 'ELECTRICAL AND ELECTRONICS (SANDWICH) (SS)', 
  'ELECTRICAL AND ELECTRONICS ENGINEERING', 'ELECTRICAL AND ELECTRONICS ENGINEERING (SS)', 
  'ELECTRONICS AND  TELECOMMUNICATION ENGINEERING', 'ELECTRONICS AND COMMUNICATION ENGINEERING', 
  'ELECTRONICS AND COMMUNICATION ENGINEERING (SS)', 'ELECTRONICS AND INSTRUMENTATION ENGINEERING', 
  'ENVIRONMENTAL ENGINEERING', 'Electrical and Computer Engineering', 
  'Electronic Instrumentation and Control Engineering', 
  'Electronics Engineering (VLSI Design and Technology)', 
  'Electronics Engineering (VLSI Design and Technology) (SS)', 
  'Electronics Engineering (VLSI design and Technology)', 
  'Electronics and Communication ( Advanced Communication Technology)', 
  'Electronics and Communication (Advanced Communication Technology)', 
  'Electronics and Computer Engineering', 'FASHION TECHNOLOGY', 'FASHION TECHNOLOGY (SS)', 
  'FOOD TECHNOLOGY', 'FOOD TECHNOLOGY (SS)', 'GEO INFORMATICS', 'HANDLOOM AND TEXTILE TECHNOLOGY', 
  'INDUSTRIAL BIO TECHNOLOGY', 'INDUSTRIAL BIO TECHNOLOGY (SS)', 'INDUSTRIAL ENGINEERING', 
  'INDUSTRIAL ENGINEERING AND MANAGEMENT', 'INFORMATION TECHNOLOGY', 'INFORMATION TECHNOLOGY (SS)', 
  'INSTRUMENTATION AND CONTROL ENGINEERING', 'INSTRUMENTATION AND CONTROL ENGINEERING (SS)', 
  'Information Science and Engineering', 'Interior Design (SS)', 'LEATHER TECHNOLOGY', 
  'M.Tech. Computer Science and Engineering (Integrated 5 years)', 'MANUFACTURING ENGINEERING', 
  'MARINE ENGINEERING', 'MATERIAL SCIENCE AND ENGINEERING (SS)', 'MECHANICAL AND AUTOMATION ENGINEERING', 
  'MECHANICAL ENGINEERING', 'MECHANICAL ENGINEERING (MANUFACTURING)', 
  'MECHANICAL ENGINEERING (SANDWICH) (SS)', 'MECHANICAL ENGINEERING (SS)', 
  'MECHANICAL ENGINEERING (TAMIL MEDIUM)', 'MECHATRONICS', 'MECHATRONICS (SS)', 
  'MEDICAL ELECTRONICS', 'MEDICAL ELECTRONICS ENGINEERING', 'METALLURGICAL ENGINEERING', 
  'METALLURGICAL ENGINEERING (SS)', 'MINING ENGINEERING', 'Mechanical Engineering (Automobile)', 
  'Mechanical and Mechatronics Engineering (Additive Manufacturing)', 
  'Mechanical and Smart Manufacturing', 'Mechatronics Engineering', 'PETRO CHEMICAL ENGINEERING', 
  'PETRO CHEMICAL TECHNOLOGY', 'PETROLEUM ENGINEERING', 'PETROLEUM ENGINEERING AND TECHNOLOGY (SS)', 
  'PHARMACEUTICAL TECHNOLOGY', 'PHARMACEUTICAL TECHNOLOGY (SS)', 'PLASTIC TECHNOLOGY', 
  'PRINTING & PACKING TECHNOLOGY', 'PRINTING AND PACKING TECHNOLOGY', 'PRODUCTION ENGINEERING', 
  'PRODUCTION ENGINEERING (SANDWICH) (SS)', 'PRODUCTION ENGINEERING (SS)', 'ROBOTICS AND AUTOMATION', 
  'ROBOTICS AND AUTOMATION (SS)', 'RUBBER AND PLASTIC TECHNOLOGY', 'Safety and Fire Engineering', 
  'TEXTILE CHEMISTRY', 'TEXTILE TECHNOLOGY', 'TEXTILE TECHNOLOGY (SS)'
].sort((a, b) => a.localeCompare(b));

// Define interface for a college record
interface CollegeRecord {
  college_name: string;
  branch_name: string;
  category: string;
  district: string;
  cutoff_mark: number;
  year: number;
  college_code: string;
  branch_code: string;
}

// Define interface for debug data
interface DebugData {
  rawCategories: (string | null)[];
  rawDistricts: (string | null)[];
  rawCourses: (string | null)[];
  categoryStats: Record<string, number>;
  districtStats: Record<string, number>;
  courseStats: Record<string, number>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters = {
    cutoff: '',
    category: '',
    locations: [],
    courses: []
  },
  onFiltersChange,
  onSearch,
  onReset,
  isAdmin,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [dataStats, setDataStats] = useState({
    totalRecords: 0,
    tableName: 'college_records',
    lastUpdated: '',
    sampleData: [] as CollegeRecord[],
  });
  const [debugData, setDebugData] = useState({
    rawCategories: [],
    rawDistricts: [],
    rawCourses: [],
    categoryStats: {},
    districtStats: {},
    courseStats: {}
  } as DebugData);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [showCourseConfirmModal, setShowCourseConfirmModal] = useState(false);

  const filteredCourses = useMemo(() => {
    return PREDEFINED_COURSES.filter(course =>
      course.toLowerCase().includes(courseSearch.toLowerCase())
    );
  }, [courseSearch]);

  const filteredDistricts = useMemo(() => {
    return PREDEFINED_DISTRICTS.filter(district =>
      district.toLowerCase().includes(districtSearch.toLowerCase())
    );
  }, [districtSearch]);

  useEffect(() => {
    if (isAdmin) {
      loadDatabaseStats();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const loadDatabaseStats = async () => {
    setIsLoading(true);
    setErrors([]);
    const newErrors: string[] = [];

    try {
      setLoadingStatus('Testing database connection...');
      
      const { data: testData, error: testError, count } = await supabase
        .from('college_records')
        .select('*', { count: 'exact' })
        .limit(10);

      if (testError) {
        newErrors.push(`Database connection error: ${testError.message}`);
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const totalRecords = count || 0;
      const sampleData = testData || [];
      
      setDataStats({
        totalRecords,
        tableName: 'college_records',
        lastUpdated: new Date().toLocaleTimeString(),
        sampleData
      });

      if (totalRecords === 0) {
        newErrors.push('No data found in college_records table. Please upload CSV data first.');
      }

      setErrors(newErrors);
    } catch (error) {
      console.error('Error loading database stats:', error);
      newErrors.push(`Loading error: ${error}`);
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  };

  const handleInputChange = (field: keyof SearchFiltersType, value: string | string[]) => {
    onFiltersChange({ 
      ...filters,
      [field]: value 
    });
  };

  const toggleSelection = (field: 'locations' | 'courses', value: string) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFiltersChange({ 
      ...filters, 
      [field]: newValues 
    });
  };

  const handleSearch = async () => {
    // Check if cutoff and category are provided (required fields)
    if (!filters.cutoff || !filters.category) {
      alert('Please enter your cutoff marks and select a category');
      return;
    }

    // If no courses are selected, show confirmation modal
    if (!filters.courses || filters.courses.length === 0) {
      setShowCourseConfirmModal(true);
      return;
    }

    // Proceed with the search
    onSearch();
  };
  
  const showRawDataAnalysis = async () => {
    try {
      console.log('\n=== RAW DATA ANALYSIS ===');
      
      const { data: allData, error } = await supabase
        .from('college_records')
        .select('category, district, branch_name')
        .limit(50);

      if (error) {
        console.error('❌ Error:', error);
        return;
      }

      console.log('📊 First 50 records analysis:');
      
      const categoryAnalysis: Record<string, number> = {};
      const districtAnalysis: Record<string, number> = {};
      const courseAnalysis: Record<string, number> = {};
      
      allData?.forEach((record, index) => {
        console.log(`${index + 1}. Category: "${record.category}" | District: "${record.district}" | Course: "${record.branch_name}"`);
        
        // Count categories
        const cat = record.category;
        if (cat === null) categoryAnalysis['NULL'] = (categoryAnalysis['NULL'] || 0) + 1;
        else if (cat === '') categoryAnalysis['EMPTY'] = (categoryAnalysis['EMPTY'] || 0) + 1;
        else categoryAnalysis[cat] = (categoryAnalysis[cat] || 0) + 1;
        
        // Count districts
        const dist = record.district;
        if (dist === null) districtAnalysis['NULL'] = (districtAnalysis['NULL'] || 0) + 1;
        else if (dist === '') districtAnalysis['EMPTY'] = (districtAnalysis['EMPTY'] || 0) + 1;
        else districtAnalysis[dist] = (districtAnalysis[dist] || 0) + 1;
        
        // Count courses
        const course = record.branch_name;
        if (course === null) courseAnalysis['NULL'] = (courseAnalysis['NULL'] || 0) + 1;
        else if (course === '') courseAnalysis['EMPTY'] = (courseAnalysis['EMPTY'] || 0) + 1;
        else courseAnalysis[course] = (courseAnalysis[course] || 0) + 1;
      });

      console.log('\n📈 CATEGORY ANALYSIS:');
      Object.entries(categoryAnalysis).forEach(([cat, count]) => {
        console.log(`  "${cat}": ${count} records`);
      });

      console.log('\n📈 DISTRICT ANALYSIS:');
      Object.entries(districtAnalysis).forEach(([dist, count]) => {
        console.log(`  "${dist}": ${count} records`);
      });

      console.log('\n📈 COURSE ANALYSIS:');
      Object.entries(courseAnalysis).forEach(([course, count]) => {
        console.log(`  "${course}": ${count} records`);
      });

      setDebugData({
        rawCategories: allData?.map(d => d.category) || [],
        rawDistricts: allData?.map(d => d.district) || [],
        rawCourses: allData?.map(d => d.branch_name) || [],
        categoryStats: categoryAnalysis,
        districtStats: districtAnalysis,
        courseStats: courseAnalysis
      });

      alert('✅ Raw data analysis complete! Check console for detailed breakdown of first 50 records.');

    } catch (error) {
      console.error('💥 Analysis error:', error);
      alert(`Analysis failed: ${error}`);
    }
  };

  
const fetchRecordsWithCourse = async () => {
  // This is just for debug purposes - doesn't affect main search
  if (!filters.courses || filters.courses.length === 0) {
    alert('Please select at least one course first for this debug function');
    return;
  }

  try {
    console.log('=== SIMPLIFIED COURSE SEARCH ===');
    console.log('🎯 Target Courses:', filters.courses);

    const { data: results, error, count } = await supabase
      .from('college_records')
      .select('*', { count: 'exact' })
      .in('branch_name', filters.courses);

    console.log('Query executed:', `SELECT * FROM college_records WHERE branch_name IN (${filters.courses.map(c => `'${c}'`).join(', ')})`);
    console.log('Results count:', count);
    console.log('Error:', error);
    console.log('Results:', results);

    if (error) {
      console.error('❌ Query error:', error);
      alert(`Query failed: ${error.message}`);
      return;
    }

    if (!results || results.length === 0) {
      console.log('❌ No records found');
      alert(`No records found for courses: ${filters.courses.join(', ')}`);
      
      const { data: allCourses } = await supabase
        .from('college_records')
        .select('branch_name')
        .limit(20);
      
      console.log('Available courses (first 20):');
      allCourses?.forEach((course, i) => {
        console.log(`${i + 1}. "${course.branch_name}"`);
      });
      
      return;
    }

    console.log('✅ Found records:');
    results.slice(0, 5).forEach((r, i) => {
      console.log(`${i + 1}. ${r.college_name} - ${r.branch_name} (${r.category}) - Cutoff: ${r.cutoff_mark}`);
    });

    alert(`✅ Found ${results.length} records for selected courses!\n\nCheck console for details.`);

  } catch (error) {
    console.error('💥 Search error:', error);
    alert(`Search failed: ${error}`);
  }
};
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Database className="h-4 w-4" />
            <span>{dataStats.totalRecords.toLocaleString()} records from {dataStats.tableName}</span>
          </div>
        )}
      </div>

      {isAdmin && errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <h3 className="font-semibold text-red-800">Issues Found:</h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {isAdmin && dataStats.sampleData.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Sample Data from {dataStats.tableName}:
          </h3>
          <div className="space-y-2">
            {dataStats.sampleData.slice(0, 3).map((record, index) => (
              <div key={index} className="bg-white rounded p-3 text-xs border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div><strong>College:</strong> {record.college_name}</div>
                  <div><strong>Branch:</strong> {record.branch_name}</div>
                  <div><strong>Category:</strong> "{record.category}"</div>
                  <div><strong>District:</strong> "{record.district}"</div>
                  <div><strong>Cutoff:</strong> {record.cutoff_mark}</div>
                  <div><strong>Year:</strong> {record.year}</div>
                  <div><strong>Code:</strong> {record.college_code}</div>
                  <div><strong>Branch Code:</strong> {record.branch_code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
            <Bug className="h-4 w-4 mr-2" />
            🔧 Enhanced Debug Functions:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={showRawDataAnalysis}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              🔍 Raw Data Analysis
            </button>
            <button
              onClick={fetchRecordsWithCourse}
              disabled={!filters.courses || filters.courses.length === 0}
              className="bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 text-blue-700 disabled:text-gray-500 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              🎓 Fetch by Courses
            </button>
          </div>
          <p className="text-yellow-700 text-xs">
            💡 Use "Raw Data Analysis" to see exactly what values exist in your database
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* First row: Cutoff and Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Cutoff Marks <span className="text-xs text-gray-500">(0-200)</span>
          </label>
          <input
            type="number"
            value={filters.cutoff || ''}
            onChange={(e) => handleInputChange('cutoff', e.target.value)}
            placeholder="Enter your marks"
            min="0"
            max="200"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-xs text-gray-500">({PREDEFINED_CATEGORIES.length} options)</span>
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select Category</option>
            {PREDEFINED_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
        {/* Second row: Courses and Districts */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Courses <span className="text-xs text-gray-500">({PREDEFINED_COURSES.length} options)</span>
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full min-w-[350px] px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            >
              <span>
                {filters.courses?.length ? `${filters.courses.length} selected` : 'Select courses...'}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCourseDropdown ? 'transform rotate-180' : ''}`} />
            </button>
            
            {showCourseDropdown && (
              <div className="absolute z-10 mt-1 min-w-[350px] w-auto bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <div className="py-1">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <div key={course} className="px-3 py-2 hover:bg-gray-100">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.courses?.includes(course) || false}
                            onChange={() => toggleSelection('courses', course)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis">{course}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No courses found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {(filters.courses?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.courses.map((course) => (
                <span key={course} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {course}
                  <button
                    type="button"
                    className="ml-2 text-blue-500 hover:text-red-600 focus:outline-none"
                    aria-label={`Remove ${course}`}
                    onClick={() => toggleSelection('courses', course)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* District Multi-Select with Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
             Preferred Districts <span className="text-xs text-gray-500">({PREDEFINED_DISTRICTS.length} options)</span>
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
            >
              <span>
                {filters.locations?.length ? `${filters.locations.length} selected` : 'Select districts...'}
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showDistrictDropdown ? 'transform rotate-180' : ''}`} />
            </button>
            
            {showDistrictDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={(e) => setDistrictSearch(e.target.value)}
                    placeholder="Search districts..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
                <div className="py-1">
                  {filteredDistricts.length > 0 ? (
                    filteredDistricts.map((district) => (
                      <div key={district} className="px-3 py-2 hover:bg-gray-100">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.locations?.includes(district) || false}
                            onChange={() => toggleSelection('locations', district)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>{district}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No districts found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          {(filters.locations?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.locations.map((district) => (
                <span key={district} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {district}
                  <button
                    type="button"
                    className="ml-2 text-green-500 hover:text-red-600 focus:outline-none"
                    aria-label={`Remove ${district}`}
                    onClick={() => toggleSelection('locations', district)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={handleSearch}
          disabled={!filters.cutoff || !filters.category}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Search (Main Function)</span>
        </button>
        <button
          onClick={onReset}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </button>
        {isAdmin && (
          <button
            onClick={loadDatabaseStats}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Reload Stats
          </button>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-gray-800 text-sm">
          <strong>🔍 Current Selection:</strong> 
          Cutoff: {filters.cutoff || 'Not set'} | 
          Category: "{filters.category || 'Not selected'}" | 
          Courses: {(filters.courses?.length || 0) > 0 
            ? filters.courses?.slice(0, 3).join(', ') + ((filters.courses?.length || 0) > 3 ? ` +${(filters.courses?.length || 0) - 3} more` : '') 
            : 'None selected'} | 
          Districts: {(filters.locations?.length || 0) > 0 
            ? filters.locations?.slice(0, 3).join(', ') + ((filters.locations?.length || 0) > 3 ? ` +${(filters.locations?.length || 0) - 3} more` : '') 
            : 'None selected'}
        </p>
      </div>

      {/* Course Confirmation Modal */}
      {showCourseConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">No Courses Selected</h3>
            </div>
            <p className="text-gray-700 mb-6">
              You haven't selected any preferred courses. This will show all available courses.
              <br /><br />
              Is this okay?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCourseConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCourseConfirmModal(false);
                  onSearch();
                }}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;