// import React, { useState, useEffect } from 'react';
// import { Search, Filter, RotateCcw, TrendingUp, Database } from 'lucide-react';
// import { dataService } from '../services/dataService';

// interface SearchFiltersProps {
//   onSearch: (filters: {
//     cutoff: number;
//     category: string;
//     district?: string;
//     course?: string;
//   }) => void;
//   onReset: () => void;
// }

// const NewSearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, onReset }) => {
//   const [cutoff, setCutoff] = useState('');
//   const [category, setCategory] = useState('');
//   const [district, setDistrict] = useState('');
//   const [course, setCourse] = useState('');
  
//   const [categories, setCategories] = useState<string[]>([]);
//   const [branches, setBranches] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [stats, setStats] = useState({
//     totalRecords: 0,
//     totalColleges: 0,
//     totalBranches: 0,
//     totalDistricts: 0,
//     categories: [],
//     avgCutoff: 0
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadFilterData();
//   }, []);

//   const loadFilterData = async () => {
//     setIsLoading(true);
//     try {
//       const [categoriesData, branchesData, districtsData, statsData] = await Promise.all([
//         dataService.getUniqueCategories(),
//         dataService.getUniqueBranches(),
//         dataService.getUniqueDistricts(),
//         dataService.getStatistics()
//       ]);

//       setCategories(categoriesData);
//       setBranches(branchesData);
//       setDistricts(districtsData);
//       setStats(statsData);
//     } catch (error) {
//       console.error('Error loading filter data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!cutoff || !category) {
//       alert('Please enter your cutoff marks and select a category');
//       return;
//     }

//     onSearch({
//       cutoff: parseFloat(cutoff),
//       category,
//       district: district || undefined,
//       course: course || undefined
//     });
//   };

//   const handleReset = () => {
//     setCutoff('');
//     setCategory('');
//     setDistrict('');
//     setCourse('');
//     onReset();
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//         <div className="flex items-center justify-center space-x-2 mb-4">
//           <Database className="h-5 w-5 text-blue-600 animate-pulse" />
//           <span className="text-gray-600">Loading search filters...</span>
//         </div>
//         <div className="animate-pulse">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 <div className="h-12 bg-gray-200 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//       <div className="flex items-center space-x-2 mb-6">
//         <Filter className="h-5 w-5 text-blue-600" />
//         <h2 className="text-xl font-semibold text-gray-900">Find Your Perfect College</h2>
//       </div>

//       {stats.totalRecords > 0 && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
//           <div className="flex items-center space-x-2 mb-2">
//             <TrendingUp className="h-4 w-4 text-blue-600" />
//             <span className="text-sm font-medium text-blue-900">Database Statistics</span>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             <div>
//               <span className="text-blue-600 font-semibold">{stats.totalRecords.toLocaleString()}</span>
//               <span className="text-blue-700 ml-1">Records</span>
//             </div>
//             <div>
//               <span className="text-blue-600 font-semibold">{stats.totalColleges}</span>
//               <span className="text-blue-700 ml-1">Colleges</span>
//             </div>
//             <div>
//               <span className="text-blue-600 font-semibold">{stats.totalBranches}</span>
//               <span className="text-blue-700 ml-1">Branches</span>
//             </div>
//             <div>
//               <span className="text-blue-600 font-semibold">{stats.avgCutoff}</span>
//               <span className="text-blue-700 ml-1">Avg Cutoff</span>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Your Cutoff Marks *
//           </label>
//           <input
//             type="number"
//             value={cutoff}
//             onChange={(e) => setCutoff(e.target.value)}
//             placeholder="Enter your marks"
//             step="0.1"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Category *
//           </label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Preferred District
//           </label>
//           <select
//             value={district}
//             onChange={(e) => setDistrict(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           >
//             <option value="">Any District</option>
//             {districts.map((dist) => (
//               <option key={dist} value={dist}>
//                 {dist}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Preferred Course
//           </label>
//           <select
//             value={course}
//             onChange={(e) => setCourse(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//           >
//             <option value="">Any Course</option>
//             {branches.map((branch) => (
//               <option key={branch} value={branch}>
//                 {branch}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 mt-6">
//         <button
//           onClick={handleSearch}
//           disabled={!cutoff || !category}
//           className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
//         >
//           <Search className="h-5 w-5" />
//           <span>Search Colleges</span>
//         </button>
//         <button
//           onClick={handleReset}
//           className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
//         >
//           <RotateCcw className="h-4 w-4" />
//           <span>Reset</span>
//         </button>
//       </div>

//       {stats.totalRecords === 0 && (
//         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-yellow-800 text-center">
//             No data available. Please upload a CSV file first to start searching.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewSearchFilters;