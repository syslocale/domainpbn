import React, { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { domainsAPI } from '../../api/client';
import { toast } from 'sonner';

const DomainImport = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(fileExt)) {
      toast.error('Format file tidak didukung. Gunakan CSV atau Excel');
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = async (file) => {
    setParsing(true);
    setErrors([]);
    setParsedData([]);

    const fileExt = file.name.split('.').pop().toLowerCase();

    try {
      if (fileExt === 'csv') {
        // Parse CSV
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            validateAndSetData(results.data);
            setParsing(false);
          },
          error: (error) => {
            toast.error(`Error parsing CSV: ${error.message}`);
            setParsing(false);
          },
        });
      } else {
        // Parse Excel
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          validateAndSetData(jsonData);
          setParsing(false);
        };
        reader.onerror = () => {
          toast.error('Error reading Excel file');
          setParsing(false);
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      toast.error('Error parsing file');
      setParsing(false);
    }
  };

  const validateAndSetData = (data) => {
    const validatedData = [];
    const validationErrors = [];

    const requiredFields = ['domain_name', 'registrar'];

    data.forEach((row, index) => {
      const errors = [];
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: Missing ${field}`);
        }
      });

      // Validate numeric fields
      const numericFields = ['da', 'pa', 'ur', 'dr', 'tf', 'cf', 'price', 'age'];
      numericFields.forEach(field => {
        if (row[field] !== undefined && row[field] !== '') {
          const num = parseInt(row[field]);
          if (isNaN(num)) {
            errors.push(`Row ${index + 1}: ${field} must be a number`);
          }
        }
      });

      if (errors.length === 0) {
        // Clean and convert data
        validatedData.push({
          domain_name: row.domain_name?.toString().trim() || '',
          da: parseInt(row.da) || 0,
          pa: parseInt(row.pa) || 0,
          ur: parseInt(row.ur) || 0,
          dr: parseInt(row.dr) || 0,
          tf: parseInt(row.tf) || 0,
          cf: parseInt(row.cf) || 0,
          price: parseInt(row.price) || 0,
          web_archive_history: row.web_archive_history?.toString().trim() || '',
          age: parseInt(row.age) || 0,
          registrar: row.registrar?.toString().trim() || '',
          status: row.status?.toString().trim() || 'available',
          notes: row.notes?.toString().trim() || '',
        });
      } else {
        validationErrors.push(...errors);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(`Found ${validationErrors.length} validation errors`);
    }

    setParsedData(validatedData);
    
    if (validatedData.length > 0) {
      toast.success(`${validatedData.length} domains ready to import`);
    }
  };

  const handleImport = async () => {
    if (parsedData.length === 0) {
      toast.error('No valid data to import');
      return;
    }

    try {
      setImporting(true);
      const response = await domainsAPI.importBulk(parsedData);
      toast.success(response.data.message);
      onSuccess();
    } catch (error) {
      console.error('Error importing domains:', error);
      toast.error('Failed to import domains');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div data-testid="domain-import">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Import Domains</h1>
            <p className="text-slate-400">Upload CSV atau Excel file untuk bulk import</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="glass-panel p-8 mb-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
            <Upload className="text-blue-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Upload File</h3>
          <p className="text-slate-400 mb-6">
            Pilih file CSV atau Excel (.xlsx, .xls) yang berisi data domain
          </p>
          
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            data-testid="file-upload-input"
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-3 font-medium transition-all cursor-pointer"
          >
            Choose File
          </label>

          {file && (
            <div className="mt-4 text-slate-300">
              Selected: <span className="font-medium text-white">{file.name}</span>
            </div>
          )}
        </div>

        {/* Format Guide */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <h4 className="text-sm font-semibold text-white mb-3">Required Columns:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-slate-300">domain_name</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-slate-300">registrar</span>
            </div>
            <div className="text-slate-500">da, pa, ur, dr</div>
            <div className="text-slate-500">tf, cf, price, age</div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Optional: web_archive_history, status, notes
          </p>
        </div>
      </div>

      {/* Parsing Status */}
      {parsing && (
        <div className="glass-panel p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Parsing file...</p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="glass-panel p-6 mb-6 border-2 border-red-500/30">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-red-400 font-semibold mb-2">Validation Errors ({errors.length})</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {errors.slice(0, 10).map((error, index) => (
                  <p key={index} className="text-sm text-slate-300">{error}</p>
                ))}
                {errors.length > 10 && (
                  <p className="text-sm text-slate-500 italic">... and {errors.length - 10} more</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {parsedData.length > 0 && (
        <div className="glass-panel p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Preview ({parsedData.length} domains)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/50 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-2 text-slate-300">Domain</th>
                  <th className="text-center px-4 py-2 text-slate-300">DR/DA</th>
                  <th className="text-center px-4 py-2 text-slate-300">PA/UR</th>
                  <th className="text-center px-4 py-2 text-slate-300">TF/CF</th>
                  <th className="text-center px-4 py-2 text-slate-300">Age</th>
                  <th className="text-left px-4 py-2 text-slate-300">Registrar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {parsedData.slice(0, 5).map((domain, index) => (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="px-4 py-2 text-white">{domain.domain_name}</td>
                    <td className="px-4 py-2 text-center text-slate-300">{domain.dr}/{domain.da}</td>
                    <td className="px-4 py-2 text-center text-slate-300">{domain.pa}/{domain.ur}</td>
                    <td className="px-4 py-2 text-center text-slate-300">{domain.tf}/{domain.cf}</td>
                    <td className="px-4 py-2 text-center text-slate-300">{domain.age}y</td>
                    <td className="px-4 py-2 text-slate-300">{domain.registrar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 5 && (
              <p className="text-sm text-slate-500 mt-3 text-center">
                ... and {parsedData.length - 5} more domains
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {parsedData.length > 0 && (
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-6 py-3 font-medium transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleImport}
            disabled={importing || errors.length > 0}
            data-testid="import-submit-button"
            className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-8 py-3 font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload size={20} />
                Import {parsedData.length} Domains
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DomainImport;
