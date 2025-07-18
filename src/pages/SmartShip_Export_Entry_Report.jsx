import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import Navbar from "../components/navbar/Navbar";
import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import './styles/cssAllStyle.css'; // Import the CSS file
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';

import { GlobalStyles } from '@mui/material';
import ReactFileReader from 'react-file-reader';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Modal from "@mui/material/Modal";
import Swal from 'sweetalert2';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { Paper, Typography, Card, CardContent } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FactoryIcon from '@mui/icons-material/Factory';
import FlightIcon from '@mui/icons-material/Flight';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ScaleIcon from '@mui/icons-material/Scale';
import InventoryIcon from '@mui/icons-material/Inventory';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tooltip from '@mui/material/Tooltip';
import AssessmentIcon from '@mui/icons-material/Assessment';

import ExcelJS from 'exceljs';

export default function SmartShip_Export_Entry_Report({ onSearch }) {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Custom_Progress = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <div className="loader"></div>
    <div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#3498db' }}>Loading Data...</div>
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const handleNavbarToggle = (openStatus) => {
      setIsNavbarOpen(openStatus); 
  };

  const [distinctExportEntryReport, setdistinctExportEntryReport] = useState([]);
  const [distinctInvNo, setdistinctInvNo] = useState([]);

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const fromDate = selectedFromDate? dayjs(selectedFromDate).format('DD/MM/YYYY') : null;
  const toDate = selectedToDate? dayjs(selectedToDate).format('DD/MM/YYYY') : null;
  const [selectedInvNo, setSelectedInvNo] = useState(null);

  const fetchInvNo = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-invoice-no-list-export-report?from_date=${fromDate}&to_date=${toDate}`
      );
      const data = response.data;
      setdistinctInvNo(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Dest: ${error}`);
    }
  };

  const handleFromDateChange = (newValue) => {
    setSelectedFromDate(newValue);
  }

  const handleToDateChange = (newValue) => {
    setSelectedToDate(newValue);
  }

  const handleSearch = async () => {
    if (!selectedFromDate || !selectedToDate) { 
      Swal.fire({
        icon: 'warning',
        title: 'Select Data',
        text: 'Please select From date / To data.',
      });
      return;
    }
    if (selectedFromDate && selectedToDate) { 
      let InvNo = '';
      if (selectedInvNo) {
          InvNo = selectedInvNo.inv_no;
      } else {
          InvNo = 'ALL'
      }
      try {
        const response = await axios.get(
          `http://10.17.100.115:3001/api/smart_ship/filter-export-entry-with-inv-no?from_date=${fromDate}&to_date=${toDate}&inv_no=${InvNo}`
        );
        const data = response.data;
        setdistinctExportEntryReport(data);
      } catch (error) {
        console.error(`Error fetching distinct data Term Dest: ${error}`);
      }
    }
  }

  const handleClear = async () => {
    setdistinctExportEntryReport([]);
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setSelectedInvNo(null);
  }

  const handleExportToExcel = async () => {
    try {
      // Check if there's data to export
      if (!distinctExportEntryReport || distinctExportEntryReport.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Data',
          text: 'No data available to export. Please search for data first.',
        });
        return;
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Export Entry Report');

      // Set column widths to match table proportions
      worksheet.columns = [
        { header: 'INVOICE NO.', key: 'inv_no', width: 20 },
        { header: 'EXPORT ENTRY', key: 'certi_no', width: 20 },
        { header: 'DUE DATE', key: 'due_date', width: 20 }
      ];

      // Style the header row to match table header (#91C8E4 background)
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF91C8E4' } // #91C8E4 in ARGB format
        };
        cell.font = {
          bold: true,
          color: { argb: 'FF000000' }, // Black text
          size: 12
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
      });

      // Set header row height
      headerRow.height = 25;

      // Add data rows
      distinctExportEntryReport.forEach((row, index) => {
        const dataRow = worksheet.addRow({
          inv_no: row.inv_no || '',
          certi_no: row.certi_no || '',
          due_date: row.due_date_1 || ''
        });

        // Style each data row to match table body (#F5F5F5 background)
        dataRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' } // #F5F5F5 in ARGB format
          };
          cell.font = {
            color: { argb: 'FF000000' }, // Black text
            size: 11
          };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
        });

        // Set data row height
        dataRow.height = 20;
      });

      // Generate filename with current date and time
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
      const filename = `InvoiceWithExportEntry_${dateStr}${timeStr}.xlsx`;

      // Generate Excel file and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: `Excel file has been downloaded successfully!`,
        // text: `Excel file "${filename}" has been downloaded successfully!`,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'An error occurred while exporting to Excel. Please try again.',
      });
    }
  };


  const handleInvNoChange = (event, newValue) => {
    setSelectedInvNo(newValue);
  }

  useEffect(() => {
    if (selectedFromDate && selectedToDate) { 
      fetchInvNo();
    }
  }, [selectedFromDate, selectedToDate]);

  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 3} marginTop={10}>
        <Box sx={{height: 80 , marginTop: '20px' , marginLeft: '40px'}}>
          <Card 
            elevation={8} 
            sx={{ 
              maxWidth: 1200, 
              // maxWidth: 'fit-content', 
              // width: 1200,
              margin: '0', 
              borderRadius: 3,
              height: 180,
              // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
              padding: 2,
              marginBottom: 3
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              {/* First Row - Main Selection Fields */}
              <Paper 
                elevation={4} 
                sx={{ 
                  padding: 1, 
                  marginTop: 1.5,
                  marginBottom: 1, 
                  borderRadius: 2,
                  height: 125,
                  background: 'linear-gradient(145deg, #f0f4f8, #e2e8f0)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    marginBottom: 2, 
                    color: '#2d3748',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <LocationOnIcon color="primary" />
                  Criteria Details
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr auto auto auto' },
                  gap: 1,
                  alignItems: 'center'
                }}>

                  {/* FROM DATE */}
                  <Box sx={{ position: 'relative' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        label="📅 FROM DATE" 
                        size="small"
                        value={selectedFromDate}
                        onChange={(newDate) => handleFromDateChange(newDate)}
                        format="DD/MM/YYYY"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            height: '56px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                            '&.Mui-focused': {
                              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>

                  {/* TO DATE */}
                  <Box sx={{ position: 'relative' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        label="📅 TO DATE" 
                        size="small"
                        value={selectedToDate}
                        onChange={(newDate) => handleToDateChange(newDate)}
                        format="DD/MM/YYYY"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            height: '56px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                            '&.Mui-focused': {
                              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>

                  <Autocomplete
                    disablePortal
                    size="small"
                    options={distinctInvNo}
                    getOptionLabel={(option) => option?.inv_no || ''}
                    value={selectedInvNo}
                    onChange={handleInvNoChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="🌍 INVOICE NO"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            height: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            },
                            '&.Mui-focused': {
                              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                            }
                          },
                          '& .MuiInputLabel-root': {
                            top: '28px',
                            left: '14px',
                            transform: 'translateY(-50%)',
                            transformOrigin: 'left center',
                            transition: 'all 0.2s ease-in-out',
                            '&.MuiInputLabel-shrink': {
                              top: 0,
                              transform: 'translate(14px, -9px) scale(0.75)'
                            }
                          }
                        }}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option && value && option.inv_no === value.inv_no
                    }
                  />
                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: '5px', marginLeft: '20px' }}>
                    <Tooltip title="Search Report" arrow>
                      <Button 
                        className="btn_hover"
                        sx={{ minWidth: '56px', height: '56px' }}
                        onClick={handleSearch}
                      >
                        <img src="/search.png" alt="" style={{ width: 45 }} />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip title="Clear Details" arrow>
                      <Button 
                        className="btn_hover"
                        sx={{ minWidth: '56px', height: '56px' }}
                        onClick={handleClear}
                      >
                        <img src="/clear.png" alt="" style={{ width: 45 }} />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip title="Export to Excel" arrow>
                      <Button 
                        className="btn_hover"
                        sx={{ minWidth: '56px', height: '56px' }}
                        onClick={handleExportToExcel}
                      >
                        <img src="/excel.png" alt="" style={{ width: 45 }} />
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </CardContent>
          </Card>

          <div style={{ height: 570, width:1800,}}>
             {/*  border: "solid black 1px" , backgroundColor: '#FAF7F3', boxShadow: '10px 10px 10px grey', borderRadius: 10,  */}
            <p style={{ backgroundColor: '#FAF7F3', boxShadow: '10px 10px 10px grey', borderRadius: 10, width: 640, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <AssessmentIcon />
              EXPORT ENTRY REPORT
            </p>
            <div style={{height: 545, width:640 , fontSize: 18, overflow: 'auto', marginTop: '5px', backgroundColor: '#FAF7F3', boxShadow: '10px 10px 10px grey', borderRadius: 10, }}>
              {isLoading ? (
                  <Custom_Progress />
              ) : (
                <table style={{height: 500, width: 600, borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10, marginLeft: 10 ,}}>
                  <thead style={{fontSize: 18, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
                    <tr>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "120px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        INVOICE NO.
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "120px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        EXPORT ENTRY
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "120px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        DUE  DATE
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: 16, textAlign: 'center' }}>
                    {distinctExportEntryReport && distinctExportEntryReport.length > 0 ? (
                      distinctExportEntryReport.map((row, index) => (
                        <tr key={index} style={{ border: 'solid black 1px',  backgroundColor: '#F5F5F5'}}>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.inv_no || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.certi_no || '-'}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.due_date_1 || ''}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td 
                          colSpan="3"
                          style={{ 
                            textAlign: 'center', 
                            padding: '20px 20px', 
                            fontStyle: 'italic',
                            fontSize: '18px',
                            color: '#6b7280',
                            width: '100%',
                            border: 'solid black 1px',
                          }}
                        >
                          📋 No data found. Please select filters and click search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
}