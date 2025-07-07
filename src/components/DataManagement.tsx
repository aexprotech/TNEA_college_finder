import React, { useState } from 'react';
import { Trash2, Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const DataManagement: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [recordCounts, setRecordCounts] = useState({
    college_data: 0,
    college_records: 0
  });

  const checkRecordCounts = async () => {
    try {
      // Check college_data table
      const { count: dataCount, error: dataError } = await supabase
        .from('college_data')
        .select('*', { count: 'exact', head: true });

      // Check college_records table
      const { count: recordsCount, error: recordsError } = await supabase
        .from('college_records')
        .select('*', { count: 'exact', head: true });

      setRecordCounts({
        college_data: dataCount || 0,
        college_records: recordsCount || 0
      });

      console.log('Current record counts:');
      console.log('college_data:', dataCount || 0);
      console.log('college_records:', recordsCount || 0);

    } catch (error) {
      console.error('Error checking record counts:', error);
    }
  };

  const deleteAllRecords = async () => {
    if (!window.confirm('⚠️ Are you sure you want to delete ALL records from both tables? This action cannot be undone!')) {
      return;
    }

    setIsDeleting(true);
    setDeleteStatus('idle');
    setDeleteMessage('');

    try {
      console.log('🗑️ Starting deletion process...');

      // Delete from college_data table
      console.log('Deleting from college_data table...');
      const { error: dataDeleteError } = await supabase
        .from('college_data')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (dataDeleteError) {
        console.error('Error deleting from college_data:', dataDeleteError);
        throw new Error(`Failed to delete from college_data: ${dataDeleteError.message}`);
      }

      // Delete from college_records table
      console.log('Deleting from college_records table...');
      const { error: recordsDeleteError } = await supabase
        .from('college_records')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (recordsDeleteError) {
        console.error('Error deleting from college_records:', recordsDeleteError);
        throw new Error(`Failed to delete from college_records: ${recordsDeleteError.message}`);
      }

      console.log('✅ All records deleted successfully!');
      
      setDeleteStatus('success');
      setDeleteMessage('✅ All records deleted successfully from both tables!');
      
      // Update record counts
      await checkRecordCounts();

    } catch (error) {
      console.error('💥 Deletion failed:', error);
      setDeleteStatus('error');
      setDeleteMessage(`❌ Deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  React.useEffect(() => {
    checkRecordCounts();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
      </div>

      {/* Current Record Counts */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Database className="h-4 w-4 mr-2" />
          Current Record Counts:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center justify-between">
              <span className="font-medium">college_data table:</span>
              <span className="text-lg font-bold text-blue-600">
                {recordCounts.college_data.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="flex items-center justify-between">
              <span className="font-medium">college_records table:</span>
              <span className="text-lg font-bold text-purple-600">
                {recordCounts.college_records.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={checkRecordCounts}
          className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Counts</span>
        </button>
      </div>

      {/* Warning Section */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="font-semibold text-red-800">⚠️ Danger Zone</h3>
        </div>
        <p className="text-red-700 text-sm mb-3">
          This will permanently delete ALL records from both college_data and college_records tables. 
          This action cannot be undone!
        </p>
        <ul className="text-red-600 text-xs space-y-1 list-disc list-inside">
          <li>All college data will be removed</li>
          <li>Search functionality will not work until new data is uploaded</li>
          <li>This prepares the database for fresh CSV upload</li>
        </ul>
      </div>

      {/* Delete Button */}
      <div className="text-center">
        <button
          onClick={deleteAllRecords}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
        >
          <Trash2 className="h-5 w-5" />
          <span>{isDeleting ? 'Deleting All Records...' : 'Delete All Records'}</span>
        </button>
      </div>

      {/* Status Messages */}
      {deleteStatus !== 'idle' && !isDeleting && (
        <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
          deleteStatus === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {deleteStatus === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <div>
            <p className="font-medium">{deleteMessage}</p>
            {deleteStatus === 'success' && (
              <p className="text-sm mt-1">
                The database is now clean and ready for your new CSV upload. 
                You can now upload your fresh data!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Next Steps After Deletion:</h3>
        <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
          <li>Click "Delete All Records" above</li>
          <li>Wait for confirmation message</li>
          <li>Upload your new CSV file using the upload component</li>
          <li>Test the search functionality with the new data</li>
        </ol>
      </div>
    </div>
  );
};

export default DataManagement;