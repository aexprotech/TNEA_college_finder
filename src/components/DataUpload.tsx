import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Database } from 'lucide-react';

interface DataUploadProps {
  onDataUploaded: (data: any[]) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [recordCount, setRecordCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const record: any = {};
        
        headers.forEach((header, index) => {
          let value = values[index] || '';
          
          // Convert numeric fields
          if (['year', 'college_code', 'opening_rank', 'closing_rank'].includes(header)) {
            value = parseInt(value) || 0;
          } else if (['cutoff_mark'].includes(header)) {
            value = parseFloat(value) || 0;
          }
          
          record[header] = value;
        });
        
        data.push(record);
      }
    }
    
    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('error');
      setUploadMessage('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setUploadProgress(0);

    try {
      setUploadMessage('Reading file...');
      setUploadProgress(20);
      
      const text = await file.text();
      
      setUploadMessage('Parsing CSV data...');
      setUploadProgress(40);
      
      const parsedData = parseCSV(text);
      
      if (parsedData.length === 0) {
        throw new Error('No data found in CSV file');
      }

      setUploadMessage('Storing data in database...');
      setUploadProgress(60);

      // Import the dataService dynamically to avoid circular imports
      const { dataService } = await import('../services/dataService');
      await dataService.storeData(parsedData);
      
      setUploadProgress(100);
      setRecordCount(parsedData.length);
      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${parsedData.length} records to local database`);
      
      onDataUploaded(parsedData);
      
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `year,college_code,college_name,branch_code,branch_name,category,cutoff_mark,district,location,institute_type,quota,gender,opening_rank,closing_rank,ranking
2023,1001,"Anna University","CS01","Computer Science Engineering","General",165.5,"Chennai","Chennai","Engineering","Tamil Nadu State","Common",1000,2000,"NIRF Ranked"
2023,1002,"PSG College of Technology","ME01","Mechanical Engineering","OBC",145.2,"Coimbatore","Coimbatore","Engineering","Tamil Nadu State","Common",2500,3500,"NIRF Ranked"
2023,1003,"Thiagarajar College","EC01","Electronics and Communication","SC",125.8,"Madurai","Madurai","Engineering","Tamil Nadu State","Common",4000,5000,"Not Ranked"
2023,1004,"Government College of Technology","CS01","Computer Science Engineering","ST",115.3,"Coimbatore","Coimbatore","Engineering","Tamil Nadu State","Common",5500,6500,"NIRF Ranked"
2023,1005,"Karunya Institute","BT01","Biotechnology","General",135.7,"Coimbatore","Coimbatore","Engineering","Tamil Nadu State","Common",3000,4000,"Not Ranked"`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_college_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Upload College Data</h2>
        </div>
        <p className="text-gray-600">Upload your CSV file to populate the college database</p>
        <p className="text-sm text-blue-600 mt-1">✨ Now supports large files with IndexedDB storage!</p>
      </div>

      {/* Sample CSV Download */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Need a sample format?</h3>
            <p className="text-sm text-blue-700">Download our sample CSV to see the expected format</p>
          </div>
          <button
            onClick={downloadSampleCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Sample CSV</span>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="mb-4">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-lg font-medium text-gray-700">Upload CSV File</p>
          <p className="text-sm text-gray-500">Click to select or drag and drop your CSV file</p>
          <p className="text-xs text-green-600 mt-1">✓ Supports large files (no size limit)</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto"
        >
          <Upload className="h-5 w-5" />
          <span>{isUploading ? 'Uploading...' : 'Select CSV File'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{uploadMessage}</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {uploadStatus !== 'idle' && !isUploading && (
        <div className={`mt-6 p-4 rounded-lg flex items-center space-x-3 ${
          uploadStatus === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {uploadStatus === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <div>
            <p className="font-medium">{uploadMessage}</p>
            {uploadStatus === 'success' && recordCount > 0 && (
              <p className="text-sm mt-1">
                Data is now stored in your browser's local database and ready for searching.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Expected CSV Format */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Expected CSV Columns:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
          <span>• year</span>
          <span>• college_code</span>
          <span>• college_name</span>
          <span>• branch_code</span>
          <span>• branch_name</span>
          <span>• category</span>
          <span>• cutoff_mark</span>
          <span>• district</span>
          <span>• location</span>
          <span>• institute_type</span>
          <span>• quota</span>
          <span>• gender</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Large files are now supported thanks to IndexedDB storage!
        </p>
      </div>
    </div>
  );
};

export default DataUpload;