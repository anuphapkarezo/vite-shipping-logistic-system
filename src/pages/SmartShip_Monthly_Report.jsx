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

export default function SmartShip_Monthly_Report({ onSearch }) {
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

  const [distinctTermDest, setdistinctTermDest] = useState([]);
  const [distinctTermFac, setdistinctTermFac] = useState([]);
  const [distinctTransCost, setdistinctTransCost] = useState([]);

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const fromDate = selectedFromDate? dayjs(selectedFromDate).format('DD/MM/YYYY') : null;
  const toDate = selectedToDate? dayjs(selectedToDate).format('DD/MM/YYYY') : null;
  const [selectedTermDest, setSelectedTermDest] = useState(null);
  const [selectedTermFac, setSelectedTermFac] = useState(null);

  const handleFromDateChange = (newValue) => {
    setSelectedFromDate(newValue);
  }

  const handleToDateChange = (newValue) => {
    setSelectedToDate(newValue);
  }

  const handleSearch = async () => {
    if (selectedFromDate && selectedToDate && selectedTermDest && selectedTermFac) { 
      console.log('fromDate' , fromDate)
      console.log('toDate' , toDate)
      console.log('selectedTermDest' , selectedTermDest.term_dest)
      console.log('selectedTermFac' , selectedTermFac.term_fac)
      try {
        const response = await axios.get(
          `http://10.17.100.115:3001/api/smart_ship/filter-transport-cost-mothly-report?from_date=${fromDate}&to_date=${toDate}&dest=${selectedTermDest.term_dest}&fact=${selectedTermFac.term_fac}`
        );
        const data = response.data;
        setdistinctTransCost(data);
      } catch (error) {
        console.error(`Error fetching distinct data Term Dest: ${error}`);
      }
    }
  }

  const handleClear = async () => {
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setSelectedTermDest(null);
    setSelectedTermFac(null);
    setdistinctTransCost([]);
  }

  const handleExportToExcel = async () => {
    if (!distinctTransCost || distinctTransCost.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'No data available to export. Please search for data first.',
      });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transportation Cost Report');

    // Define headers exactly as in table
    const headers = [
      'FACTORY', 'PORT DESTINATION', 'PRODUCT GROUP', 'TRADE TERM', 'INV NO.',
      'WEIGHT (CW)', 'TIME', 'FLIGHT', 'SHIP DATE', 'TOTAL PACK',
      'DIMENSION (CM)', 'FORWARDER', 'FOB', 'RATE (THB/KG)', 'AIR FREIGHT (THB)',
      'OTHER CHARGE', 'NET AMOUNT'
    ];

    // Add headers
    const headerRow = worksheet.addRow(headers);
    
    // Style headers exactly like table
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colNumber === 17 ? 'FF4D55CC' : 'FF91C8E4' }
      };
      cell.font = {
        bold: true,
        size: 12,
        color: { argb: colNumber === 17 ? 'FFFFFFFF' : 'FF000000' }
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    // Set row height for header (50px equivalent)
    headerRow.height = 37.5;

    // Add data rows
    distinctTransCost.forEach((row) => {
      const dataRow = worksheet.addRow([
        row.term_fac || '',
        row.term_dest || '',
        row.prd_grp || '',
        row.trd_term || '',
        row.inv_no || '',
        row.cw_weight || '',
        row.flight_time || '',
        row.flight_name || '',
        row.ship_date || '',
        row.total_pack || '',
        row.ivd_dim || '',
        row.fwd || '',
        row.serv_charge || '',
        row.air_rate || '',
        formatNumber(row.air_bath) || '',
        formatNumber(row.other_chrage) || '',
        formatNumber(row.total_cost) || ''
      ]);

      // Style data rows exactly like table
      dataRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF5F5F5' }
        };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
        cell.font = { size: 11 };
        
        // Text alignment based on column (like table)
        if ([3, 5, 8].includes(colNumber)) { // PRODUCT GROUP, INV NO, FLIGHT
          cell.alignment = { horizontal: 'left', vertical: 'middle' };
        } else {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }

        // Special styling for NET AMOUNT column (underline double)
        if (colNumber === 17) {
          cell.font = { size: 11, underline: 'double' };
        }
      });

      // Set row height for data (30px equivalent)
      dataRow.height = 22.5;
    });

    // Auto-fit column widths based on content
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: false }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      });
      // Set width with some padding (minimum 8, maximum 50)
      column.width = Math.min(Math.max(maxLength + 2, 8), 50);
    });

    // Generate filename with current date

    // const fileName = `Flight_Condition_Details_${dateStr}${timeStr}.xlsx`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
    const filename = `MonthlyReportTransportationCost_${dateStr}${timeStr}.xlsx`;

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  const fetchTermDest = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-dets-term-list-monthly-report?from_date=${fromDate}&to_date=${toDate}`
      );
      const data = response.data;
      setdistinctTermDest(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Dest: ${error}`);
    }
  };

  const fetchTermfact = async () => {
    try {
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-fac-list-monthly-report?from_date=${fromDate}&to_date=${toDate}&dest=${selectedTermDest.term_dest}`
      );
      const data = response.data;
      setdistinctTermFac(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Dest: ${error}`);
    }
  };

  const handleTermDestChange = (event, newValue) => {
    setSelectedTermDest(newValue);
  }

  const handleTermFacChange = (event, newValue) => {
    setSelectedTermFac(newValue);
  }

  const formatNumber = (value) => {
    if (!value || value === '' || isNaN(value)) return '';
    return Number(value).toLocaleString();
  };

  useEffect(() => {
    if (selectedFromDate && selectedToDate) { 
      fetchTermDest();
    }
    if (selectedFromDate && selectedToDate && selectedTermDest) { 
      fetchTermfact();
    }
  }, [selectedFromDate, selectedToDate, selectedTermDest]);

  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 3} marginTop={10}>
        <Box sx={{height: 80 , marginTop: '20px' , marginLeft: '40px'}}>
          <Card 
            elevation={8} 
            sx={{ 
              maxWidth: 1300, 
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
                  gap: 2,
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

                  {/* TERM DEST */}
                  <Autocomplete
                    disablePortal
                    size="small"
                    options={distinctTermDest}
                    getOptionLabel={(option) => option?.term_dest || ''}
                    value={selectedTermDest}
                    onChange={handleTermDestChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="🌍 EXPORT ENTRY"
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
                      option && value && option.term_dest === value.term_dest
                    }
                  />

                  {/* FACTORY */}
                  <Autocomplete
                    disablePortal
                    size="small"
                    options={distinctTermFac}
                    getOptionLabel={(option) => option?.term_fac || ''}
                    value={selectedTermFac}
                    onChange={handleTermFacChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="🏭 FACTORY"
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
                            top: '16px',
                            left: '14px',
                            transform: 'none',
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
                      option && value && option.term_fac === value.term_fac
                    }
                  />

                  {/* Action Buttons */}
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
              </Paper>
            </CardContent>
          </Card>

          <div style={{ height: 570, width:1800, border: "solid black 1px" , backgroundColor: '#FAF7F3', boxShadow: '10px 10px 10px grey', borderRadius: 10, }}>
            <p style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <AssessmentIcon />
              TRANSPORTATION COST MONTHLY REPORT
            </p>
            <div style={{width:1780 , fontSize: 18, overflow: 'auto', marginTop: '5px', marginLeft: '5px', marginRight: '5px', }}>
              {isLoading ? (
                  <Custom_Progress />
              ) : (
                <table style={{width: 3200, borderCollapse: 'collapse', tableLayout: 'fixed',}}>
                  <thead style={{fontSize: 18, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
                    <tr>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "55px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        FACTORY
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
                        PORT DESTINATION
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "200px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        PRODUCT GROUP
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "100px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        TRADE TERM
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "150px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        INV NO.
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "80px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        WEIGHT (CW)
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "40px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        TIME
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "100px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        FLIGHT 
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "70px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        SHIP DATE
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "70px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        TOTAL PACK
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "100px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        DIMENSION (CM)
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "80px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        FORWARDER
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        FOB
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "80px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        RATE (THB/KG)
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "100px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        AIR FREIGHT (THB)
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#91C8E4",
                            width: "100px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        OTHER CHARGE
                      </th>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#4D55CC",
                            width: "100px",
                            border: 'solid black 1px',
                            color: 'white',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                        NET AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: 16, textAlign: 'center' }}>
                    {distinctTransCost && distinctTransCost.length > 0 ? (
                      distinctTransCost.map((row, index) => (
                        <tr key={index} style={{ border: 'solid black 1px',  backgroundColor: '#F5F5F5'}}>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.term_fac || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.term_dest || ''}</td>
                          <td style={{ border: 'solid black 1px', 
                                       height: "30px", 
                                       textAlign: 'left', 
                                       paddingLeft: "10px", 
                                     }}>
                            {row.prd_grp || ''}
                          </td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.trd_term || ''}</td>
                          <td style={{ border: 'solid black 1px', 
                                       height: "30px", 
                                       textAlign: 'left', 
                                       paddingLeft: "10px", 
                                       whiteSpace: 'nowrap', 
                                       overflow: 'hidden', 
                                       textOverflow: 'ellipsis', 
                                       maxWidth: '150px' ,
                                       cursor: row.term_dest ? "pointer" : "default" ,
                                     }}
                              onMouseDown={(e) => e.currentTarget.style.whiteSpace = "normal"}
                              onMouseUp={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                              onMouseLeave={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                          >
                            {row.inv_no || ''}
                          </td>
                          {/* <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.inv_no || ''}</td> */}
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.cw_weight || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.flight_time || ''}</td>
                          <td style={{ border: 'solid black 1px', 
                                       height: "30px", 
                                       textAlign: 'left', 
                                       paddingLeft: "10px", 
                                     }}>
                            {row.flight_name || ''}
                          </td>
                          {/* <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.flight_name || ''}</td> */}
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.ship_date || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.total_pack || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.ivd_dim || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.fwd || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.serv_charge || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{row.air_rate || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{formatNumber(row.air_bath) || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px",  }}>{formatNumber(row.other_chrage) || ''}</td>
                          <td style={{ border: 'solid black 1px', height: "30px", textDecoration: 'underline double'  }}>{formatNumber(row.total_cost) || ''}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td 
                          colSpan="16" 
                          style={{ 
                            textAlign: 'center', 
                            padding: '20px 20px', 
                            fontStyle: 'italic',
                            fontSize: '18px',
                            color: '#6b7280',
                            // backgroundColor: '#f9fafb',
                            // border: 'solid #e5e7eb 1px',
                            // fontWeight: '500'
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