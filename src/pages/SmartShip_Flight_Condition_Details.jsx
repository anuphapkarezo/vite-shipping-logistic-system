import React, { useState, useEffect , useRef } from "react";
import Box from '@mui/material/Box';
import { GlobalStyles } from '@mui/material';
import Navbar from "../components/navbar/Navbar";
import ReactFileReader from 'react-file-reader';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from "axios";
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

import * as XLSX from 'xlsx';

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

  const fetchData = async () => {
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavbarToggle = (openStatus) => {
      setIsNavbarOpen(openStatus);
  };
  
  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 3} marginTop={10}>
        <Box sx={{height: 80 , marginTop: '10px' , marginLeft: '60px'}}>
          <div style={{height: 780, width:1800 , marginRight: 25, fontSize: 14, overflow: 'auto',}}>
            {isLoading ? (
                <Custom_Progress />
            ) : (
                <table style={{width: 2100, borderCollapse: 'collapse', marginTop: 10, }}>
                  <thead style={{fontSize: 15, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
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
                              width: "70px",
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
                            width: "70px",
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
                            width: "70px",
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
                    </tr>
                    
                  </thead>
                  <tbody style={{ fontSize: 14, textAlign: 'center' }}>
                    <tr>
                      <td>FUKUOKA</td>
                      <td>A1</td>
                      <td>SIAM NISTRANS</td>
                      <td>B</td>
                      <td>same day night(incl mid night)flight</td>
                      <td>Direct</td>
                      <td>VZ</td>
                    </tr>
                  </tbody>
              </table>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
}