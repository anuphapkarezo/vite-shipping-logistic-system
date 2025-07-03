import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import Navbar from "../components/navbar/Navbar";
import { Autocomplete, TextField } from "@mui/material";
import Button from '@mui/material/Button';
import axios from "axios";
import './styles/cssAllStyle.css'; // Import the CSS file

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

import ExcelJS from 'exceljs';

export default function SmartShip_Flight_Condition_Details({ onSearch }) {
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

  const [distinctTermType, setdistinctTermType] = useState([]);
  const [distinctTermDest, setdistinctTermDest] = useState([]);
  const [distinctTermFac, setdistinctTermFac] = useState([]);
  const [distinctTermFwd, setdistinctTermFwd] = useState([]);
  const [distinctFlightName, setdistinctFlightName] = useState([]);
  const [distinctFlightCondition, setdistinctFlightCondition] = useState([]);

  const [selectedTermType, setSelectedTermType] = useState(null);
  const [selectedTermDest, setSelectedTermDest] = useState(null);
  const [selectedTermFac, setSelectedTermFac] = useState(null);
  const [selectedTermFwd, setSelectedTermFwd] = useState(null);
  const [selectedFlightName, setSelectedFlightName] = useState(null);

  const fetchTermType = async () => {
    try {
      const response = await axios.get(
        "http://10.17.100.115:3001/api/smart_ship/filter-term-type-ship"
      );
      const data = response.data;
      setdistinctTermType(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Type: ${error}`);
    }
  };

  const fetchTermDest = async () => {
    try {
      let termType = '';
      if (selectedTermType) {
          termType = selectedTermType.term_type;
      } else {
          termType = 'ALL'
      }

      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-term-dest-ship?term_type=${termType}`
      );

      const data = response.data;
      setdistinctTermDest(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Dest: ${error}`);
    }
  };

  const fetchTermFac = async () => {
    try {
      let termType = '';
      if (selectedTermType) {
          termType = selectedTermType.term_type;
      } else {
          termType = 'ALL'
      }

      let termDest = '';
      if (selectedTermDest) {
          termDest = selectedTermDest.term_dest;
      } else {
          termDest = 'ALL'
      }

      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-term-fac-ship?term_type=${termType}&term_dest=${termDest}`
      );

      const data = response.data;
      setdistinctTermFac(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Fac: ${error}`);
    }
  };

  const fetchTermFwd = async () => {
    try {
      let termType = '';
      if (selectedTermType) {
          termType = selectedTermType.term_type;
      } else {
          termType = 'ALL'
      }

      let termDest = '';
      if (selectedTermDest) {
          termDest = selectedTermDest.term_dest;
      } else {
          termDest = 'ALL'
      }

      let termFac = '';
      if (selectedTermFac) {
          termFac = selectedTermFac.term_fac;
      } else {
          termFac = 'ALL'
      }

      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-term-fwd-ship?term_type=${termType}&term_dest=${termDest}&term_fac=${termFac}`
      );

      const data = response.data;
      setdistinctTermFwd(data);
    } catch (error) {
      console.error(`Error fetching distinct data Term Fwd: ${error}`);
    }
  };

  const fetchFlightName = async () => {
    try {
      let termType = '';
      if (selectedTermType) {
          termType = selectedTermType.term_type;
      } else {
          termType = 'ALL'
      }

      let termDest = '';
      if (selectedTermDest) {
          termDest = selectedTermDest.term_dest;
      } else {
          termDest = 'ALL'
      }

      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-flight-name-ship?term_type=${termType}&term_dest=${termDest}`
      );

      const data = response.data;
      setdistinctFlightName(data);
    } catch (error) {
      console.error(`Error fetching distinct data Flight Name: ${error}`);
    }
  };

  // API : fetchFlightCondition
  // http://10.17.100.115:3001/api/smart_ship/filter-flight-condition-detail?term_type=C&term_dest=FUKUOKA&term_fac=A1&term_fwd=SIAM%20NISTRANS&flight_name=ALL

  useEffect(() => {
    fetchTermType();
    fetchTermDest();
    fetchTermFac();
    fetchTermFwd();
    fetchFlightName();
  }, [selectedTermType, selectedTermDest, selectedTermFac, selectedTermFwd, selectedFlightName]);

  const handleNavbarToggle = (openStatus) => {
      setIsNavbarOpen(openStatus);
  };

  const handleTermTypeChange = (event, newValue) => {
    setSelectedTermType(newValue);
    setSelectedTermDest(null);
    setSelectedTermFac(null);
    setSelectedTermFwd(null);
    setSelectedFlightName(null);
  }

  const handleTermDestChange = (event, newValue) => {
    setSelectedTermDest(newValue);
    setSelectedTermFac(null);
    setSelectedTermFwd(null);
    setSelectedFlightName(null);
  }

  const handleTermFacChange = (event, newValue) => {
    setSelectedTermFac(newValue);
    setSelectedTermFwd(null);
  }

  const handleTermFwdChange = (event, newValue) => {
    setSelectedTermFwd(newValue);
  }

  const handleFlightNameChange = (event, newValue) => {
    setSelectedFlightName(newValue);
  }

  const handleSearch = async () => {
    let termType = '';
    if (selectedTermType) {
        termType = selectedTermType.term_type;
    } else {
        termType = 'ALL'
    }

    let termDest = '';
    if (selectedTermDest) {
        termDest = selectedTermDest.term_dest;
    } else {
        termDest = 'ALL'
    }

    let termFac = '';
    if (selectedTermFac) {
        termFac = selectedTermFac.term_fac;
    } else {
        termFac = 'ALL'
    }

    let termFwd = '';
    if (selectedTermFwd) {
        termFwd = selectedTermFwd.term_fwd;
    } else {
        termFwd = 'ALL'
    }

    let flightName = '';
    if (selectedFlightName) {
        flightName = selectedFlightName.flight_name;
    } else {
        flightName = 'ALL'
    }

    // console.log('termType:', termType);
    // console.log('termDest:', termDest);
    // console.log('termFac:', termFac); 
    // console.log('termFwd:', termFwd);
    // console.log('flightName:', flightName);
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-flight-condition-detail?term_type=${termType}&term_dest=${termDest}&term_fac=${termFac}&term_fwd=${termFwd}&flight_name=${flightName}`
      );
      const data = response.data;
      setdistinctFlightCondition(data);
    } catch (error) {
      console.error(`Error fetching distinct data SUS Delivery order: ${error}`);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleClear = () => {
    setSelectedTermType(null);
    setSelectedTermDest(null);
    setSelectedTermFac(null);
    setSelectedTermFwd(null);
    setSelectedFlightName(null);
    setdistinctFlightCondition([]);
  };

  // Add this function after your imports and before the component
  const formatNumber = (value) => {
    if (!value || value === '' || isNaN(value)) return '';
    return Number(value).toLocaleString();
  };

  const handleExportToExcel = async () => {
    if (!distinctFlightCondition || distinctFlightCondition.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'No data available to export. Please search for data first.',
      });
      return;
    }

    try {
      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Flight Condition Details');

      // Define headers
      const headers = [
        'DESTINATION', 'FACTORY', 'FORWARDER', 'TYPE', 'DESCRIPTION', 'STATUS', 'CARRIER',
        'FOB', 'MIN CHARGE', '-45[KG]', '+45[KG]', '+100[KG]', '+300[KG]', '+500[KG]', '+1000[KG]', 'MIN[KG]',
        'FLIGHT', 'TIME', 'LEADTIME', 'OPERATE DAY', 'REMARK',
        'MIN CHARGE', 'RATE [KG]', 'REMARK'
      ];

      // Add headers
      worksheet.addRow(headers);

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.height = 25;
      
      headers.forEach((header, index) => {
        const cell = headerRow.getCell(index + 1);
        
        // Different colors for different sections
        let fillColor = '4D55CC'; // Default blue
        
        // Trade Term Details (columns 1-3)
        if (index >= 0 && index <= 2) {
          fillColor = '4D55CC';
        }
        // Flight Service (columns 4-7)
        else if (index >= 3 && index <= 6) {
          fillColor = 'E0EDFF';
        }
        // Airfreight Export Quotation (columns 8-16)
        else if (index >= 7 && index <= 15) {
          fillColor = '4D55CC';
        }
        // Transit Time (columns 17-21)
        else if (index >= 16 && index <= 20) {
          fillColor = 'E0EDFF';
        }
        // Destination All In (columns 22-24)
        else if (index >= 21 && index <= 23) {
          fillColor = 'F68537';
        }

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
        
        cell.font = {
          bold: true,
          color: { argb: (fillColor === 'E0EDFF' || fillColor === 'F68537') ? '000000' : 'FFFFFF' }
        };
        
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        
        cell.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } }
        };
      });

      // Add data rows
      distinctFlightCondition.forEach((row, rowIndex) => {
        const dataRow = [
          row.term_dest || '',
          row.term_fac || '',
          row.term_fwd || '',
          row.flight_type || '',
          row.flight_desc || '',
          row.flight_status || '',
          row.flight_carr || '',
          row.fob || '',
          row.fligh_min_charge || '',
          row.rate_under_45 || '',
          row.rate_over_45 || '',
          row.rate_over_100 || '',
          row.rate_over_300 || '',
          row.rate_over_500 || '',
          row.rate_over_1000 || '',
          row.min_kg || '',
          row.flight_name || '',
          row.flight_time || '',
          row.flight_lt || '',
          row.operate_day || '',
          row.remark || '',
          row.min_charge || '',
          row.rate_kg || '',
          row.ai_remark || ''
        ];

        const excelRow = worksheet.addRow(dataRow);
        excelRow.height = 20;

        // Style data cells
        dataRow.forEach((cellValue, colIndex) => {
          const cell = excelRow.getCell(colIndex + 1);
          
          // Background color
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F5F5F5' }
          };
          
          // Alignment
          if ([0, 4, 16, 17, 20, 23].includes(colIndex)) {
            // Left align for text columns
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          } else {
            // Center align for others
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
          
          // Number formatting for numeric columns
          if ([8, 9, 10, 11, 12, 13, 14, 15, 21, 22].includes(colIndex)) {
            if (cellValue && !isNaN(cellValue)) {
              cell.numFmt = '#,##0';
              cell.value = Number(cellValue);
            }
          }
          
          // Borders
          cell.border = {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } }
          };
        });
      });

      // Set column widths
      const columnWidths = [25, 10, 15, 8, 30, 10, 10, 8, 12, 10, 10, 10, 10, 10, 10, 10, 15, 20, 10, 15, 30, 12, 12, 30];
      columnWidths.forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
      });

      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
      const fileName = `Flight_Condition_Details_${dateStr}${timeStr}.xlsx`;

      // Save file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        // text: `Export Successful`,
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Export error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'An error occurred while exporting the data.',
      });
    }
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 3} marginTop={10}>
        <Box sx={{height: 80 , marginTop: '20px' , marginLeft: '60px'}}>
          <div style={{ height: 55, width:1800, display: "flex", flexDirection: "row", }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo-product"
              size="small"
              options={distinctTermType}
              getOptionLabel={(option) => option?.term_type || ''}
              value={selectedTermType}
              onChange={handleTermTypeChange}
              sx={{ width: 150, height: 50, marginTop: 1, }}
              renderInput={(params) => (
                <TextField {...params} label="Term Type" />
              )}
              isOptionEqualToValue={(option, value) =>
                option && value && option.term_type === value.term_type
              }
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo-product"
              size="small"
              options={distinctTermDest}
              getOptionLabel={(option) => option?.term_dest || ''}
              value={selectedTermDest}
              onChange={handleTermDestChange}
              sx={{ width: 300, height: 50, marginLeft: 2, marginTop: 1,}}
              renderInput={(params) => (
                <TextField {...params} label="Destination" />
              )}
              isOptionEqualToValue={(option, value) =>
                option && value && option.term_dest === value.term_dest
              }
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo-product"
              size="small"
              options={distinctTermFac}
              getOptionLabel={(option) => option?.term_fac || ''}
              value={selectedTermFac}
              onChange={handleTermFacChange}
              sx={{ width: 150, height: 50, marginLeft: 2, marginTop: 1,}}
              renderInput={(params) => (
                <TextField {...params} label="Factory" />
              )}
              isOptionEqualToValue={(option, value) =>
                option && value && option.term_fac === value.term_fac
              }
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo-product"
              size="small"
              options={distinctTermFwd}
              getOptionLabel={(option) => option?.term_fwd || ''}
              value={selectedTermFwd}
              onChange={handleTermFwdChange}
              sx={{ width: 230, height: 50, marginLeft: 2, marginTop: 1,}}
              renderInput={(params) => (
                <TextField {...params} label="Forwarder" />
              )}
              isOptionEqualToValue={(option, value) =>
                option && value && option.term_fwd === value.term_fwd
              }
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo-product"
              size="small"
              options={distinctFlightName}
              getOptionLabel={(option) => option?.flight_name || ''}
              value={selectedFlightName}
              onChange={handleFlightNameChange}
              sx={{ width: 250, height: 50, marginLeft: 2, marginTop: 1,}}
              renderInput={(params) => (
                <TextField {...params} label="Flight Name" />
              )}
              isOptionEqualToValue={(option, value) =>
                option && value && option.flight_name === value.flight_name
              }
            />
            <Button 
                className="btn_hover"
                onClick={handleSearch}
            >
                <img src="/search.png" alt="" style={{ width: 45, marginLeft: 10, }} />
            </Button>
            <Button 
                className="btn_hover"
                onClick={handleClear}
            >
                <img src="/clear.png" alt="" style={{ width: 45, }} />
            </Button>
            <Button 
                className="btn_hover"
                onClick={handleExportToExcel}
            >
                <img src="/excel.png" alt="" style={{ width: 45, }} />
            </Button>
          </div>
          <div style={{height: 720, width:1800 , marginRight: 25, fontSize: 14, overflow: 'auto', border: 'solid black 1px',marginTop: '10px'}}>
            {isLoading ? (
                <Custom_Progress />
            ) : (
                <table style={{width: 3320, borderCollapse: 'collapse', }}>
                  {/* <thead style={{fontSize: 15, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
                    <tr>
                      <th
                        colSpan={3}
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          width: "210px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",   
                          fontWeight: 'normal',
                        }}
                      >
                        TRADE TERM DETAILS
                      </th>
                      <th
                        colSpan={4}
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          width: "280px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",   
                          fontWeight: 'normal',
                        }}
                      >
                        FLIGHT SERVICE
                      </th>
                      <th
                        colSpan={9}
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          width: "450px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",   
                          fontWeight: 'normal',
                        }}
                      >
                        AIRFREIGHT EXPORT QUOTATION
                      </th>
                      <th
                        colSpan={5}
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          width: "300px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",   
                          fontWeight: 'normal',
                        }}
                      >
                        TRANSIT TIME
                      </th>
                      <th
                        colSpan={3}
                        style={{
                          position: "sticky",
                          top: 0,
                          zIndex: 2,
                          textAlign: "center",
                          backgroundColor: "#AED2FF",
                          width: "300px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",   
                          fontWeight: 'normal',
                        }}
                      >
                        DESTINATION ALL IN
                      </th>
                    </tr>
                    <tr>
                      <React.Fragment key={"trade_term_details"}>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                              textAlign: "center",
                              backgroundColor: "#E0EDFF",
                              width: "110px",
                              border: 'solid black 1px',
                              color: 'black',
                              height: "30px",
                              fontWeight: 'normal',
                            }}
                          >
                          DESTINATION
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          FACTORY
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          FORWARDER
                        </th>
                      </React.Fragment>
                      <React.Fragment key={"flight_service"}>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                              textAlign: "center",
                              backgroundColor: "#E0EDFF",
                              width: "70px",
                              border: 'solid black 1px',
                              color: 'black',
                              height: "30px",
                              fontWeight: 'normal',
                            }}
                          >
                          TYPE
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "70px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          DESCRIPTION
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "70px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          STATUS
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "70px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          CARRIER
                        </th>
                      </React.Fragment>
                      <React.Fragment key={"airfreight_export_quotation"}>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                              textAlign: "center",
                              backgroundColor: "#E0EDFF",
                              width: "50px",
                              border: 'solid black 1px',
                              color: 'black',
                              height: "30px",
                              fontWeight: 'normal',
                            }}
                          >
                          FOB
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          MIN CHARGE
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          -45[KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          +45[KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          +100[KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          +300[KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          +500[KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          +1000[KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          MIN[KG]
                        </th>
                      </React.Fragment>
                      <React.Fragment key={"transit_time"}>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                              textAlign: "center",
                              backgroundColor: "#E0EDFF",
                              width: "50px",
                              border: 'solid black 1px',
                              color: 'black',
                              height: "30px",
                              fontWeight: 'normal',
                            }}
                          >
                          FLIGHT
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          TIME
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          LEADTIME
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          OPERATE DAY
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          REMARK
                        </th>
                      </React.Fragment>
                      <React.Fragment key={"destination_all_in"}>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                              textAlign: "center",
                              backgroundColor: "#E0EDFF",
                              width: "60px",
                              border: 'solid black 1px',
                              color: 'black',
                              height: "30px",
                              fontWeight: 'normal',
                            }}
                          >
                          MIN CHARGE
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "60px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          RATE [KG]
                        </th>
                        <th
                          style={{
                            position: "sticky",
                            top: 40,
                            zIndex: 2,
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "120px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "30px",
                            fontWeight: 'normal',
                          }}
                        >
                          REMARK
                        </th>
                      </React.Fragment>
                    </tr>
                    
                  </thead> */}
                  <thead style={{fontSize: 15, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
                    <tr>
                      <th
                        style={{
                            textAlign: "center",
                            backgroundColor: "#4D55CC",
                            width: "200px",
                            border: 'solid white 1px',
                            color: 'white',
                            height: "40px",
                            fontWeight: 'bold',
                          }}
                        >
                        DESTINATION
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "20px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        FACTORY
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "40px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        FORWARDER
                      </th>
                      <th
                        style={{
                          
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "30px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "40px",
                            fontWeight: 'bold',
                          }}
                        >
                        TYPE
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "200px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        DESCRIPTION
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "60px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        STATUS
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "60px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        CARRIER
                      </th>
                      <th
                        style={{
                          
                            textAlign: "center",
                            backgroundColor: "#4D55CC",
                            width: "50px",
                            border: 'solid white 1px',
                            color: 'white',
                            height: "40px",
                            fontWeight: 'bold',
                          }}
                        >
                        FOB
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        MIN CHARGE
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        -45[KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        +45[KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        +100[KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        +300[KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        +500[KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        +1000[KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#4D55CC",
                          width: "50px",
                          border: 'solid white 1px',
                          color: 'white',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        MIN[KG]
                      </th>
                      <th
                        style={{
                          
                            textAlign: "center",
                            backgroundColor: "#E0EDFF",
                            width: "50px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "40px",
                            fontWeight: 'bold',
                          }}
                        >
                        FLIGHT
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "150px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        TIME
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "40px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        LEADTIME
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "100px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        OPERATE DAY
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#E0EDFF",
                          width: "300px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        REMARK
                      </th>
                      <th
                        style={{
                          
                            textAlign: "center",
                            backgroundColor: "#F68537",
                            width: "60px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "40px",
                            fontWeight: 'bold',
                          }}
                        >
                        MIN CHARGE
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#F68537",
                          width: "60px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        RATE [KG]
                      </th>
                      <th
                        style={{
                          
                          textAlign: "center",
                          backgroundColor: "#F68537",
                          width: "300px",
                          border: 'solid black 1px',
                          color: 'black',
                          height: "40px",
                          fontWeight: 'bold',
                        }}
                      >
                        REMARK
                      </th>
                      <th
                        style={{
                          
                            textAlign: "center",
                            backgroundColor: "#F68537",
                            width: "70px",
                            border: 'solid black 1px',
                            color: 'black',
                            height: "40px",
                            fontWeight: 'bold',
                          }}
                        >
                        RE-PACKING
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: 14, textAlign: 'center' }}>
                    {distinctFlightCondition && distinctFlightCondition.length > 0 ? (
                      distinctFlightCondition.map((row, index) => (
                        <tr key={index} style={{ border: 'solid black 1px', height: "30px", backgroundColor: '#F5F5F5'}}>
                          {/* Trade Term Details */}
                          <td style={{ border: 'solid black 1px', 
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
                          >{row.term_dest || ''}
                          </td>
                          <td style={{ border: 'solid black 1px',  }}>{row.term_fac || ''}</td>
                          <td style={{ border: 'solid black 1px',  }}>{row.term_fwd || ''}</td>
                          
                          {/* Flight Service */}
                          <td style={{ border: 'solid black 1px',  }}>{row.flight_type || ''}</td>
                          <td style={{ border: 'solid black 1px', textAlign: 'left', paddingLeft: "10px" }}>{row.flight_desc || ''}</td>
                          <td style={{ border: 'solid black 1px', textAlign: 'right', paddingRight: "5px"}}>{row.flight_status || ''}</td>
                          <td style={{ border: 'solid black 1px',  }}>{row.flight_carr || ''}</td>
                          
                          {/* Airfreight Export Quotation */}
                          <td style={{ border: 'solid black 1px', }}>{row.fob || ''}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.fligh_min_charge)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_under_45)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_over_45)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_over_100)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_over_300)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_over_500)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_over_1000)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.min_kg)}</td>
                          
                          {/* Transit Time */}
                          <td style={{ border: 'solid black 1px', textAlign: 'left', paddingLeft: "10px",}}>{row.flight_name || ''}</td>
                          <td style={{ border: 'solid black 1px', 
                                       textAlign: 'left', 
                                       paddingLeft: "10px",
                                       whiteSpace: 'nowrap', 
                                       overflow: 'hidden', 
                                       textOverflow: 'ellipsis', 
                                       maxWidth: '150px' ,
                                       cursor: row.flight_time ? "pointer" : "default" ,
                                     }}
                              onMouseDown={(e) => e.currentTarget.style.whiteSpace = "normal"}
                              onMouseUp={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                              onMouseLeave={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                          >{row.flight_time || ''}
                          </td>
                          <td style={{ border: 'solid black 1px',  }}>{row.flight_lt || ''}</td>
                          <td style={{ border: 'solid black 1px',  }}>{row.operate_day || ''}</td>
                          <td style={{ border: 'solid black 1px', 
                                       textAlign: "left", 
                                       paddingLeft: "10px",
                                       whiteSpace: 'nowrap', 
                                       overflow: 'hidden', 
                                       textOverflow: 'ellipsis', 
                                       maxWidth: '150px' ,
                                       cursor: row.remark ? "pointer" : "default" ,
                                     }}
                              onMouseDown={(e) => e.currentTarget.style.whiteSpace = "normal"}
                              onMouseUp={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                              onMouseLeave={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                          >{row.remark || ''}
                          </td>
                          
                          {/* Destination All In */}
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.min_charge)}</td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_kg)}</td>
                          <td style={{ border: 'solid black 1px', 
                                       textAlign: 'left', 
                                       paddingLeft: "10px",
                                       whiteSpace: 'nowrap', 
                                       overflow: 'hidden', 
                                       textOverflow: 'ellipsis', 
                                       maxWidth: '150px' ,
                                       cursor: row.remark ? "pointer" : "default" ,
                                     }}
                              onMouseDown={(e) => e.currentTarget.style.whiteSpace = "normal"}
                              onMouseUp={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                              onMouseLeave={(e) => e.currentTarget.style.whiteSpace = "nowrap"}
                          >{row.ai_remark || ''}
                          </td>
                          <td style={{ border: 'solid black 1px', }}>{formatNumber(row.rate_pallet)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="24" style={{ textAlign: 'center', padding: '20px', fontStyle: 'italic' }}>
                          No data found. Please select filters and click search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
          </div>
        </Box>
      </Box>
    </>
  );
}