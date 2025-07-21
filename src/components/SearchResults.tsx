import React, { useState, useEffect } from 'react';
import { CollegeData } from '../lib/supabase';
import CourseInsightsModal from './CourseInsightsModal';
import { 
  MapPin, 
  Award, 
  TrendingUp, 
  Building, 
  Users, 
  Target, 
  Star, 
  Zap, 
  Navigation, 
  Heart, 
  Percent, 
  TrendingDown,
  Minus,
  ExternalLink
} from 'lucide-react';

interface SearchResultsProps {
  selectedDistricts: SmartSearchResult[];
  otherDistricts: SmartSearchResult[];
  isLoading: boolean;
  wishlist: SmartSearchResult[];
  onToggleWishlist: (college: SmartSearchResult) => void;
}

type LocationPriority = 'Selected Districts' | 'Other Districts';

interface SmartSearchResult extends CollegeData {
  cutoffDifference: number;
  proximityScore: number;
  matchType: 'Perfect Match' | 'Very Close' | 'Good Option' | 'Consider This';
  locationPriority: LocationPriority;
  admissionProbability: number;
  cutoff_mark_2023?: string | number | null;
  cutoff_mark_2024?: string | number | null;
  cutoffTrend?: 'up' | 'down' | 'stable';
}

const RESULTS_PER_PAGE = 20;

const SearchResults: React.FC<SearchResultsProps> = ({
  selectedDistricts,
  otherDistricts,
  isLoading,
  wishlist = [],
  onToggleWishlist = () => {}
}) => {
  const [selectedCollege, setSelectedCollege] = useState<SmartSearchResult | null>(null);
  const [currentTab, setCurrentTab] = useState<'selected' | 'other'>('selected');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page whenever tab or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, selectedDistricts, otherDistricts]);

  const results = currentTab === 'selected' ? selectedDistricts : otherDistricts;
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('search-results-top');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openCollegeInsights = (college: SmartSearchResult) => {
    setSelectedCollege(college);
  };

  const closeModal = () => {
    setSelectedCollege(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Searching with location-prioritized algorithm...</p>
        <p className="text-sm text-blue-600 mt-2">📍 Selected districts colleges first, then sorted by cutoff proximity</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Target className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Colleges Found</h3>
        <p className="text-gray-600 mb-4">
          No colleges found matching your criteria with the location-prioritized algorithm.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Try These Suggestions:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Remove the course filter to see more options</li>
            <li>• Try a different category</li>
            <li>• Remove district filter for broader search</li>
            <li>• Check if your cutoff is realistic for the selected category</li>
            <li>• Use the debug functions to verify data availability</li>
          </ul>
        </div>
      </div>
    );
  }

  const getMatchTypeInfo = (matchType: string) => {
    switch (matchType) {
      case 'Perfect Match':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: '🎯', 
          description: 'Cutoff within ±2 marks' 
        };
      case 'Very Close':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: '⭐', 
          description: 'Cutoff within ±5 marks' 
        };
      case 'Good Option':
        return { 
          color: 'bg-purple-100 text-purple-800 border-purple-200', 
          icon: '👍', 
          description: 'Cutoff within ±10 marks' 
        };
      case 'Consider This':
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200', 
          icon: '🤔', 
          description: 'Worth considering' 
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: '📋', 
          description: 'Standard match' 
        };
    }
  };

  const getLocationPriorityInfo = (priority: LocationPriority) => {
    switch (priority) {
      case 'Selected Districts':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: '📍',
          description: 'Your preferred districts'
        };
      case 'Other Districts':
        return {
          color: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: '🗺️',
          description: 'Other districts'
        };
    }
  };

  const groupedByLocation = results.reduce((groups, result) => {
    const locationKey = result.locationPriority;
    if (!groups[locationKey]) groups[locationKey] = [];
    groups[locationKey].push(result);
    return groups;
  }, {} as Record<LocationPriority, SmartSearchResult[]>);

  const selectedDistrictsCount = selectedDistricts.length;
  const otherDistrictsCount = otherDistricts.length;

  return (
    <div className="space-y-6">
      <div id="search-results-top" />
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
            Colleges Found ({selectedDistrictsCount + otherDistrictsCount})
          </h2>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-t-lg border-b-2 font-semibold transition-colors ${currentTab === 'selected' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-white hover:bg-gray-50'}`}
            onClick={() => setCurrentTab('selected')}
          >
            📍 Selected Districts ({selectedDistrictsCount})
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg border-b-2 font-semibold transition-colors ${currentTab === 'other' ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-white hover:bg-gray-50'}`}
            onClick={() => setCurrentTab('other')}
          >
            🗺️ Other Districts ({otherDistrictsCount})
          </button>
        </div>
      </div>
      {paginatedResults.length > 0 ? (
        <>
          {paginatedResults.map((result, index) => {
                const matchInfo = getMatchTypeInfo(result.matchType);
                
                return (
                  <div key={index} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 ${
                    result.locationPriority === 'Selected Districts' ? 'border-emerald-500' : 'border-slate-400'
                  }`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold text-gray-900 flex-1">
                            {result.college_name}
                          </h4>
                          <button
                            onClick={() => onToggleWishlist(result)}
                            className={`p-1 rounded-full transition-colors ${
                              wishlist.some(item => item.id === result.id)
                                ? 'text-red-500 hover:text-red-700'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart 
                              className="h-5 w-5" 
                              fill={
                                wishlist.some(item => item.id === result.id) 
                                  ? "currentColor" 
                                  : "none"
                              } 
                            />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{result.district}</span>
                           
                          </div>
                          <div className="flex items-center">
                            
                            <span className="ml-2 bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs">College Code : {result.college_code}</span>
                          </div>
                          <div className="flex items-center">
                            {result.ranking && result.ranking !== 'Not Ranked' && (
                              <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs mr-2">
                                NIRF {result.ranking}
                              </span>
                            )}
                            <Percent className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="text-sm font-medium text-blue-900 mr-2">Admission Chance</span>
                            <div className="w-32 max-w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              {typeof result.admissionProbability === 'number' ? (
                                <div
                                  className={`h-2.5 rounded-full ${
                                    result.admissionProbability >= 90 ? 'bg-green-500' :
                                    result.admissionProbability >= 80 ? 'bg-blue-500' :
                                    result.admissionProbability >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${result.admissionProbability}%` }}
                                ></div>
                              ) : (
                                <div className="h-2.5 rounded-full bg-red-500" style={{ width: '30%' }}></div>
                              )}
                            </div>
                            <span className="text-xs text-gray-700">
                              {typeof result.admissionProbability === 'number'
                                ? `${result.admissionProbability}%`
                                : 'Low'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Branch</span>
                        </div>
                        <button
                          className="block w-full text-left text-xs font-semibold text-blue-700 hover:underline hover:text-blue-900 transition-colors focus:outline-none"
                          onClick={() => openCollegeInsights(result)}
                          type="button"
                          title={result.branch_name}
                          style={{ minHeight: '1.75rem' }}
                        >
                          <span className="inline-flex items-center flex-wrap">
                            {result.branch_name}
                            <ExternalLink className="h-4 w-4 ml-1 text-blue-500 flex-shrink-0" />
                          </span>
                        </button>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Cutoff Marks</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.cutoff_mark_2023 && result.cutoff_mark_2024 ? (
                            <>
                              <div className="text-sm font-semibold text-green-700">
                                <div className="flex items-center">
                                  <span>2024: {result.cutoff_mark_2024}</span>
                                  {result.cutoffTrend === 'up' && <TrendingUp className="h-4 w-4 ml-1 text-red-500" />}
                                  {result.cutoffTrend === 'down' && <TrendingDown className="h-4 w-4 ml-1 text-green-500" />}
                                  {result.cutoffTrend === 'stable' && <Minus className="h-4 w-4 ml-1 text-gray-500" />}
                                </div>
                                <div className="text-xs text-gray-500">
                                  2023: {result.cutoff_mark_2023}
                                </div>
                              </div>
                            </>
                          ) :  result.cutoff_mark_2024 ? (
                            <span className="text-sm font-semibold text-green-700">
                              2024: {result.cutoff_mark_2024}
                            </span>
                          ) : result.cutoff_mark_2023 ? (
                            <span className="text-sm font-semibold text-green-700">
                              2023: {result.cutoff_mark_2023}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">No cutoff data</span>
                          )}
                          <span className="text-xs text-gray-500 ml-1">
                            (±{result.cutoffDifference.toFixed(1)})
                          </span>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Category</span>
                        </div>
                        <p className="text-sm font-semibold text-purple-700">{result.category}</p>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Star className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-900">Match Type</span>
                        </div>
                        <p className="text-sm font-semibold text-orange-700">{result.matchType}</p>
                      </div>
                    </div>

                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        Branch Code: {result.branch_code}
                      </span>
                      {result.quota && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {result.quota}
                        </span>
                      )}
                      {result.opening_rank && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          Opening Rank: {result.opening_rank}
                        </span>
                      )}
                      {result.closing_rank && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                          Closing Rank: {result.closing_rank}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {(() => {
              const pages = [];
              const pageWindow = 2;
              for (let page = 1; page <= totalPages; page++) {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - pageWindow && page <= currentPage + pageWindow)
                ) {
                  pages.push(
                    <button
                      key={page}
                      className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === currentPage - pageWindow - 1 && page > 1) ||
                  (page === currentPage + pageWindow + 1 && page < totalPages)
                ) {
                  pages.push(
                    <span key={`ellipsis-${page}`} className="px-2 text-gray-400 select-none">...</span>
                  );
                }
              }
              return pages;
            })()}
            <button
              className="px-3 py-1 rounded border bg-white text-gray-700 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">No results found.</div>
      )}

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
        <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
          <Navigation className="h-5 w-5 mr-2" />
          How We Help You Find Your Best Fit:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-700">
          <div>
            <h4 className="font-medium mb-2">🎯 Step 1: Tell Us About You</h4>
            <p>Just enter your marks, category, and preferences—no need to be a topper!</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">📊 Step 2: See Your Options</h4>
            <p>We’ll show you colleges where you have a great chance, sorted to make your choice easy.</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200">
          <p className="text-emerald-800 text-sm">
            <strong>💡 Your future is bright—let’s take the first step together!</strong>
          </p>
        </div>
      </div>

      {selectedCollege && (
        <CourseInsightsModal 
          college={selectedCollege} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default SearchResults;