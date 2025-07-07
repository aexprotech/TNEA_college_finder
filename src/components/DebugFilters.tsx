import React, { useState, useEffect } from 'react';
import { Database, AlertCircle, CheckCircle, Wifi, WifiOff, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DebugFilters: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState({
    connectionStatus: 'checking',
    environmentVars: {
      supabaseUrl: '',
      hasAnonKey: false
    },
    tableAccess: {
      college_data: { canRead: false, error: null, count: 0 },
      college_records: { canRead: false, error: null, count: 0 }
    },
    rawData: {
      categories: [],
      districts: [],
      branches: [],
      sampleRecords: []
    },
    uniqueValues: {
      categories: [],
      districts: [],
      branches: []
    },
    errors: [],
    networkRequests: [],
    queryResults: {}
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runComprehensiveDebug();
  }, []);

  const runComprehensiveDebug = async () => {
    setIsLoading(true);
    const errors = [];
    const networkRequests = [];
    const queryResults = {};

    try {
      // 1. Check Environment Variables
      console.log('=== DEBUGGING STEP 1: Environment Variables ===');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const hasAnonKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('Supabase URL:', supabaseUrl);
      console.log('Has Anon Key:', hasAnonKey);
      
      if (!supabaseUrl || !hasAnonKey) {
        errors.push('Missing environment variables');
      }

      // 2. Test Both Tables
      console.log('=== DEBUGGING STEP 2: Testing Both Tables ===');
      let connectionStatus = 'connected';
      const tableAccess = {
        college_data: { canRead: false, error: null, count: 0 },
        college_records: { canRead: false, error: null, count: 0 }
      };

      // Test college_data table
      try {
        const { data: testData1, error: testError1, count } = await supabase
          .from('college_data')
          .select('*', { count: 'exact' })
          .limit(1);

        networkRequests.push({
          query: 'college_data table test',
          success: !testError1,
          error: testError1?.message,
          data: testData1
        });

        if (testError1) {
          tableAccess.college_data.error = testError1.message;
          errors.push(`college_data table error: ${testError1.message}`);
          console.error('college_data Error:', testError1);
        } else {
          tableAccess.college_data.canRead = true;
          tableAccess.college_data.count = count || 0;
          console.log('college_data table accessible, count:', count);
        }
      } catch (connError1) {
        errors.push(`college_data exception: ${connError1}`);
        console.error('college_data Exception:', connError1);
      }

      // Test college_records table
      try {
        const { data: testData2, error: testError2, count } = await supabase
          .from('college_records')
          .select('*', { count: 'exact' })
          .limit(1);

        networkRequests.push({
          query: 'college_records table test',
          success: !testError2,
          error: testError2?.message,
          data: testData2
        });

        if (testError2) {
          tableAccess.college_records.error = testError2.message;
          errors.push(`college_records table error: ${testError2.message}`);
          console.error('college_records Error:', testError2);
        } else {
          tableAccess.college_records.canRead = true;
          tableAccess.college_records.count = count || 0;
          console.log('college_records table accessible, count:', count);
        }
      } catch (connError2) {
        errors.push(`college_records exception: ${connError2}`);
        console.error('college_records Exception:', connError2);
      }

      // Determine which table to use for further testing
      const useTable = tableAccess.college_data.canRead ? 'college_data' : 
                      tableAccess.college_records.canRead ? 'college_records' : null;

      if (!useTable) {
        connectionStatus = 'error';
        errors.push('No accessible tables found');
      } else {
        console.log(`Using table: ${useTable} for further testing`);
      }

      // 3. Fetch Sample Records (if we have an accessible table)
      console.log('=== DEBUGGING STEP 3: Sample Records ===');
      let sampleRecords = [];
      if (useTable) {
        try {
          const { data: samples, error: sampleError } = await supabase
            .from(useTable)
            .select('*')
            .limit(5);

          networkRequests.push({
            query: `Sample Records from ${useTable}`,
            success: !sampleError,
            error: sampleError?.message,
            data: samples
          });

          if (sampleError) {
            errors.push(`Sample records error: ${sampleError.message}`);
            console.error('Sample Records Error:', sampleError);
          } else {
            sampleRecords = samples || [];
            console.log('Sample Records:', sampleRecords);
          }
        } catch (sampleErr) {
          errors.push(`Sample records exception: ${sampleErr}`);
          console.error('Sample Records Exception:', sampleErr);
        }
      }

      // 4. Test Individual Column Queries (if we have an accessible table)
      console.log('=== DEBUGGING STEP 4: Column Queries ===');
      const columnQueries = [
        { name: 'categories', column: 'category' },
        { name: 'districts', column: 'district' },
        { name: 'branches', column: 'branch_name' }
      ];

      const rawData = { categories: [], districts: [], branches: [], sampleRecords };
      const uniqueValues = { categories: [], districts: [], branches: [] };

      if (useTable) {
        for (const query of columnQueries) {
          try {
            console.log(`Fetching ${query.name} from ${query.column} in ${useTable}...`);
            
            const { data, error } = await supabase
              .from(useTable)
              .select(query.column)
              .not(query.column, 'is', null);

            networkRequests.push({
              query: `${query.name} (${query.column}) from ${useTable}`,
              success: !error,
              error: error?.message,
              data: data
            });

            queryResults[query.name] = {
              success: !error,
              error: error?.message,
              count: data?.length || 0,
              sample: data?.slice(0, 3),
              table: useTable
            };

            if (error) {
              errors.push(`${query.name} error: ${error.message}`);
              console.error(`${query.name} Error:`, error);
            } else {
              rawData[query.name] = data || [];
              const unique = [...new Set(data?.map(item => item[query.column]) || [])];
              uniqueValues[query.name] = unique.sort();
              console.log(`${query.name} unique values (${unique.length}):`, unique.slice(0, 5));
            }
          } catch (queryErr) {
            errors.push(`${query.name} exception: ${queryErr}`);
            console.error(`${query.name} Exception:`, queryErr);
          }
        }
      }

      // 5. Update Debug Info
      setDebugInfo({
        connectionStatus,
        environmentVars: {
          supabaseUrl: supabaseUrl || 'NOT SET',
          hasAnonKey
        },
        tableAccess,
        rawData,
        uniqueValues,
        errors,
        networkRequests,
        queryResults
      });

    } catch (globalError) {
      console.error('Global Debug Error:', globalError);
      errors.push(`Global error: ${globalError}`);
      setDebugInfo(prev => ({ ...prev, errors }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Wifi className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Table Access Debug</h2>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Testing both tables...</p>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                {getStatusIcon(debugInfo.connectionStatus)}
                <h3 className="text-lg font-semibold">Connection Status</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Supabase URL:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                    {debugInfo.environmentVars.supabaseUrl}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Has Anon Key:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    debugInfo.environmentVars.hasAnonKey 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {debugInfo.environmentVars.hasAnonKey ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Table Access Status */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Table Access Status:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(debugInfo.tableAccess).map(([tableName, access]) => (
                  <div key={tableName} className="bg-white rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {access.canRead ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{tableName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Access: {access.canRead ? 'Can Read' : 'Cannot Read'}</p>
                      <p>Count: {access.count}</p>
                      {access.error && <p className="text-red-600">Error: {access.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Errors */}
            {debugInfo.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Errors Found:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {debugInfo.errors.map((error, index) => (
                    <li key={index} className="text-red-700 text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Query Results */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">Query Results:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(debugInfo.queryResults).map(([key, result]) => (
                  <div key={key} className="bg-white rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium capitalize">{key}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Table: {result.table}</p>
                      <p>Count: {result.count}</p>
                      {result.error && <p className="text-red-600">Error: {result.error}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Data */}
            {debugInfo.rawData.sampleRecords.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">Sample Records (First 2):</h3>
                <div className="space-y-2">
                  {debugInfo.rawData.sampleRecords.slice(0, 2).map((record, index) => (
                    <div key={index} className="bg-white rounded p-3 text-xs">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div><strong>College:</strong> {record.college_name}</div>
                        <div><strong>Category:</strong> {record.category}</div>
                        <div><strong>District:</strong> {record.district}</div>
                        <div><strong>Branch:</strong> {record.branch_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unique Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">
                  Categories ({debugInfo.uniqueValues.categories.length})
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {debugInfo.uniqueValues.categories.length > 0 ? (
                    debugInfo.uniqueValues.categories.map((category, index) => (
                      <div key={index} className="bg-white px-2 py-1 rounded text-sm">
                        {category}
                      </div>
                    ))
                  ) : (
                    <p className="text-orange-600 text-sm">No categories found</p>
                  )}
                </div>
              </div>

              {/* Districts */}
              <div className="bg-teal-50 rounded-lg p-4">
                <h3 className="font-semibold text-teal-800 mb-3">
                  Districts ({debugInfo.uniqueValues.districts.length})
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {debugInfo.uniqueValues.districts.length > 0 ? (
                    debugInfo.uniqueValues.districts.slice(0, 10).map((district, index) => (
                      <div key={index} className="bg-white px-2 py-1 rounded text-sm">
                        {district}
                      </div>
                    ))
                  ) : (
                    <p className="text-teal-600 text-sm">No districts found</p>
                  )}
                  {debugInfo.uniqueValues.districts.length > 10 && (
                    <p className="text-teal-600 text-xs italic">
                      ... and {debugInfo.uniqueValues.districts.length - 10} more
                    </p>
                  )}
                </div>
              </div>

              {/* Branches */}
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-800 mb-3">
                  Branches ({debugInfo.uniqueValues.branches.length})
                </h3>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {debugInfo.uniqueValues.branches.length > 0 ? (
                    debugInfo.uniqueValues.branches.slice(0, 10).map((branch, index) => (
                      <div key={index} className="bg-white px-2 py-1 rounded text-sm">
                        {branch}
                      </div>
                    ))
                  ) : (
                    <p className="text-indigo-600 text-sm">No branches found</p>
                  )}
                  {debugInfo.uniqueValues.branches.length > 10 && (
                    <p className="text-indigo-600 text-xs italic">
                      ... and {debugInfo.uniqueValues.branches.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Retry Button */}
            <div className="text-center">
              <button
                onClick={runComprehensiveDebug}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Run Debug Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugFilters;