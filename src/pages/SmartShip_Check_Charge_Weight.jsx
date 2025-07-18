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

import ExcelJS from 'exceljs';

export default function SmartShip_Check_Charge_Weight({ onSearch }) {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const now_x = new Date();
  const year = now_x.getFullYear();
  const month_x = (now_x.getMonth() + 1).toString().padStart(2, '0');
  const date = now_x.getDate().toString().padStart(2, '0');
  const hours = now_x.getHours().toString().padStart(2, '0');
  const minutes = now_x.getMinutes().toString().padStart(2, '0');
  const recDate = date +'/'+ month_x +'/'+ year;

  const [distinctTermDest, setdistinctTermDest] = useState([]);
  const [distinctTermFac, setdistinctTermFac] = useState([]);
  const [distinctFlightName, setdistinctFlightName] = useState([]);
  const [distinctDestCharge, setDistinctDestCharge] = useState([]);
  const [distinctRateKg, setDistinctRateKg] = useState([]);
  const [distinctInvNo, setDistinctInvNo] = useState([]);

  const [selectedInvNo, setSelectedInvNo] = useState([]);
  const [selectedFlightName, setSelectedFlightName] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedPallet, setSelectedPallet] = useState('');
  const [selectedTermDest, setSelectedTermDest] = useState(null);
  const [selectedTermFac, setSelectedTermFac] = useState(null);
  const [selectedDestCharge, setSelectedDestCharge] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCertNo, setSelectedCertNo] = useState('');
  const [selectedAirWayBill, setSelectedAirWayBill] = useState('');
  const [selectedShipDate, setSelectedShipDate] = useState(null);
  const [selectedOtherAmount, setSelectedOtherAmount] = useState('');
  const [selectedMinAir, setSelectedMinAir] = useState('');
  const [selectedRemarkAir, setSelectedRemarkAir] = useState('');
  
  const [ratefob, setRatefob] = useState(null);
  const [rateTHB, setRateTHB] = useState(null);
  const [ratePallet, setRatePallet] = useState(null);
  const [totalAir, setTotalAir] = useState(null);
  const [totalAll, setTotalAll] = useState(null);
  const [totalAllIn, setTotalAllIn] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

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

  const userString = localStorage.getItem("userToken");
  const userObject = JSON.parse(userString);
  const userName = userObject?.user_name;
  const userSurname = userObject?.user_surname;
  const ShortSurname = userSurname?.charAt(0);
  const update_by = userName +'.'+ ShortSurname; 
  const userEmpID = userObject?.emp_id;
  const userUpperName = userObject?.user_name?.toUpperCase();
  userObject.update_by = update_by;
  const UpperUpdate_By = userObject?.update_by?.toUpperCase();

  const fetchTermDest = async () => {
    try {
      let termType = 'ALL';

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
      let termType = 'ALL';

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

  const fetchFlightName = async () => {
    try {
      let termType = 'ALL';

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

  const fetchDestChargeOptions = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-detail-for-all-in?term_dest=${selectedTermDest.term_dest}&term_fac=${selectedTermFac.term_fac}`
      );
      const data = response.data;
      setDistinctDestCharge(data);
    } catch (error) {
      console.error(`Error fetching destination charge options: ${error}`);
    }
  };

  const fetchRateKg = async () => {
    try {
      // Replace with your actual API endpoint
      if (!selectedTermDest || !selectedTermFac || !selectedDestCharge) {
        // console.log('Missing required data for fetchRateKg');
        return;
      }
      const response = await axios.get(
        `http://10.17.100.115:3001/api/smart_ship/filter-detail-for-rate-kg-all-in?term_dest=${selectedTermDest.term_dest}&term_fac=${selectedTermFac.term_fac}&min_charge=${selectedDestCharge.min_charge}`
      );
      const data = response.data;
      let rateKg = 0;
      if (data && data.length > 0 && data[0]) {
        rateKg = data[0].rate_kg;
        setDistinctRateKg(rateKg);

        // let sumTotalAir = rateTHB * selectedWeight;
        // let sumRePack = ratePallet * selectedPallet;
        let sumAllin = 0
        let min_charge = selectedDestCharge.min_charge;
        // let min_charge = selectedDestCharge?.min_charge || 0; //distinctDestCharge[0]?.min_charge; 

        let averageKg = 0;
        if (min_charge > 0) {
          averageKg = (min_charge / rateKg).toFixed(2);
          if(selectedWeight > averageKg){
            sumAllin = rateKg * selectedWeight;
            setSelectedDestCharge(null);
          } else {
            sumAllin = min_charge;
          }
          setTotalAllIn(sumAllin);
        } 
        
        // if (selectedRemarkAir === '' && rateTHB > 0) {
        //   console.log('DEST1');
        //   let sumTotalAll = (sumTotalAir + ratefob + sumRePack + sumAllin) ;
        //   setTotalAll(sumTotalAll);
        // } else if (rateTHB === 0) {
        //   console.log('DEST2');
        //   setTotalAll(null);
        // } else {
        //   console.log('DEST3');
        //   let sumTotalAll = (selectedMinAir + ratefob + sumRePack + sumAllin) ;
        //   setTotalAll(sumTotalAll);
        // }

        // let sumTotalAll = (sumTotalAir + ratefob + sumRePack + sumAllin) ;
        // setTotalAll(sumTotalAll);
      } else {
        setDistinctRateKg('0');
      }
    } catch (error) {
      console.error(`Error fetching rate kg options: ${error}`);
    }
  };

  const handleNavbarToggle = (openStatus) => {
      setIsNavbarOpen(openStatus); 
  };

  // const handleInvNoChange = (newValue) => {
  //   setSelectedInvNo(newValue);
  // }
  const handleInvNoChange = (newValue) => {
    setSelectedInvNo(newValue || []);
  }

  const handleWeightChange = (newValue) => {
    const numericValue = newValue === '' ? '' : Number(newValue);
    setSelectedWeight(numericValue);
    setTotalAir(null);
    setTotalAllIn(null);
    setSelectedDestCharge(null);
    setRatePallet(null);
    setSelectedPallet('');
    setTotalAll(null);
    setSelectedRemarkAir('');
    setSelectedOtherAmount('');
  }

  const handlePalletChange = (newValue) => {
    setSelectedPallet(newValue);  
    setSelectedOtherAmount('');
    setTotalAll(null);
    let sumTotalAir = rateTHB * selectedWeight;
    if (selectedRemarkAir === '') {
      setTotalAir(sumTotalAir);
    } else {
      setTotalAir(selectedMinAir);
    }
    
    // let sumRePack = ratePallet * newValue;
    // let chkDest = distinctDestCharge[0]?.min_charge; 

    // if(chkDest === 0){
    //   log('TERM C');
    //   if (selectedRemarkAir === '' && rateTHB > 0) {
    //     let sumTotalAll = (sumTotalAir + ratefob + sumRePack) ;
    //     setTotalAll(sumTotalAll);
    //   } else if (rateTHB === 0) {
    //     setTotalAll(null);
    //   } else {
    //     let sumTotalAll = (selectedMinAir + ratefob + sumRePack) ;
    //     setTotalAll(sumTotalAll);
    //   }
    // } else {
    //   // setTotalAll(null);
    // }
  }

  const handleTermDestChange = (event, newValue) => {
    setSelectedTermDest(newValue);
    setSelectedTermFac(null);
    setSelectedInvNo('');
    setSelectedFlightName('');
    setSelectedWeight('');
    setSelectedPallet('');
    setSelectedDestCharge(null);
    setDistinctRateKg([]);
    setDistinctDestCharge([]);
    setSelectedOtherAmount('');
    setSelectedAirWayBill('');
    setSelectedCertNo('');
    setSelectedShipDate(null);
    setSelectedDate(null);
    setSelectedRemarkAir('');
    setDistinctInvNo([]);

    setRatefob(null);
    setRateTHB(null);
    setRatePallet(null);
    setTotalAir(null);
    setTotalAll(null);
    setTotalAllIn(null);
  }

  const handleClear = () => {
    setSelectedTermDest(null);
    setSelectedTermFac(null);
    setSelectedInvNo([]);
    setSelectedFlightName('');
    setSelectedWeight('');
    setSelectedPallet('');
    setSelectedDestCharge(null);
    setDistinctRateKg([]);
    setDistinctDestCharge([]);
    setSelectedOtherAmount('');
    setSelectedAirWayBill('');
    setSelectedCertNo('');
    setSelectedShipDate(null);
    setSelectedDate(null);
    setSelectedRemarkAir('');
    setDistinctInvNo([]);

    setRatefob(null);
    setRateTHB(null);
    setRatePallet(null);
    setTotalAir(null);
    setTotalAll(null);
    setTotalAllIn(null);
  }

  const handleSave = async () => {
    const ternDest = selectedTermDest?.term_dest || '';
    const ternFac = selectedTermFac?.term_fac  || '';;
    const flightName = selectedFlightName?.flight_name || '';;
    const recDate = selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : null;
    const shipDate = selectedShipDate? dayjs(selectedShipDate).format('DD/MM/YYYY') : null;
    const certNo = selectedCertNo ? selectedCertNo : '';
    const airWayBill = selectedAirWayBill ? selectedAirWayBill : '';
    // const invNo = selectedInvNo ? selectedInvNo : '';
    const invNo = selectedInvNo && selectedInvNo.length > 0 ? selectedInvNo.map(inv => inv.inv_no).join(', ') : '';
    const weight = selectedWeight ? selectedWeight : 0;
    const pallet = selectedPallet ? selectedPallet : 0;
    const rate_THB = rateTHB ? rateTHB : 0;
    // const destChrage = selectedDestCharge?.min_charge || 0;
    const destChrage = totalAllIn ? totalAllIn : 0;
    const servCharge = ratefob ? ratefob : 0;
    const repackCharge = ratePallet ? ratePallet : 0;
    const otherAmount = selectedOtherAmount ? selectedOtherAmount : 0;
    const netAmount = totalAll ? totalAll : 0;

    if (ternDest === '' || ternFac === '' || flightName === '' || recDate === null || 
        shipDate === null || certNo === '' || airWayBill === '' || invNo === '' || 
        weight === 0 || pallet === 0 || netAmount === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Required fields are incomplete. Please verify.',
      });
      return;
    }

    const swalWithZIndex = Swal.mixin({
      customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
      },
    });

    // 
    const result = await swalWithZIndex.fire({
      title: "Confirm Save",
      text: "Are you sure want to save this Export Entry?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Note: DateCim variable is not defined in the provided code, you may need to define it
        const response = await axios.get(`http://10.17.100.115:3001/api/smart_ship/filter-count-certi-awb?certi_no=${certNo}&awb_no=${airWayBill}`);
        const data = response.data;
        const CountData = data[0].count_cert;

        if (CountData > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate Entry Found',
            text: 'This details already exists in the system.',
          });
          handleClear();
          return;
        }
        
        await axios.get(
          `http://10.17.100.115:3001/api/smart_ship/insert-check-bill-chrage-trans-rec?term_dest=${ternDest}&term_fac=${ternFac}&flight_name=${flightName}&rec_date=${recDate}&ship_date=${shipDate}&certi_no=${certNo}&awb_no=${airWayBill}&inv_no=${invNo}&cw_weight=${weight}&pack_pall=${pallet}&air_rate=${rate_THB}&dest_charge=${destChrage}&serv_charge=${servCharge}&repack_charge=${repackCharge}&other_chrage=${otherAmount}&net_amount=${netAmount}&create_by=${UpperUpdate_By}&create_date=${recDate}&update_by=${UpperUpdate_By}&update_date=${recDate}`
        );
        
        Swal.fire({
          icon: "success",
          title: "Save Successful",
          text: "Export Entry data has been saved successfully!",
          confirmButtonText: "OK",
        });
        handleClear();
      } catch (error) {
        console.error(`Error saving data:`, error.message);
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: "An error occurred while saving. Please try again.",
          confirmButtonText: "OK",
        });
      }
    }
  };


  const handleSave1 = async () => {
    const ternDest = selectedTermDest?.term_dest || '';
    const ternFac = selectedTermFac?.term_fac  || '';;
    const flightName = selectedFlightName?.flight_name || '';;
    const recDate = selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : null;
    const shipDate = selectedShipDate? dayjs(selectedShipDate).format('DD/MM/YYYY') : null;
    const certNo = selectedCertNo ? selectedCertNo : '';
    const airWayBill = selectedAirWayBill ? selectedAirWayBill : '';
    const invNo = selectedInvNo ? selectedInvNo : '';
    const weight = selectedWeight ? selectedWeight : 0;
    const pallet = selectedPallet ? selectedPallet : 0;
    const rate_THB = rateTHB ? rateTHB : 0;
    const destChrage = selectedDestCharge?.min_charge || 0;
    const servCharge = ratefob ? ratefob : 0;
    const repackCharge = ratePallet ? ratePallet : 0;
    const otherAmount = selectedOtherAmount ? selectedOtherAmount : 0;
    const netAmount = totalAll ? totalAll : 0;

    if (ternDest === '' || ternFac === '' || flightName === '' || recDate === null || 
        shipDate === null || certNo === '' || airWayBill === '' || invNo === '' || 
        weight === 0 || pallet === 0 || netAmount === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Required fields are incomplete. Please verify.',
      });
      return;
    }

    const swalWithZIndex = Swal.mixin({
      customClass: {
          popup: 'my-swal-popup', // Define a custom class for the SweetAlert popup
      },
    });

    // http://10.17.100.115:3001/api/smart_ship/filter-count-certi-awb?certi_no=A011-1-6802-16151&awb_no=94015309454
    swalWithZIndex.fire({
      title: "Confirm Save",
       text: "Are you sure want to save this Export Entry?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.get(
          `http://10.17.100.115:3001/api/smart_ship/insert-check-bill-chrage-trans-rec?term_dest=${ternDest}&term_fac=${ternFac}&flight_name=${flightName}&rec_date=${recDate}&ship_date=${shipDate}&certi_no=${certNo}&awb_no=${airWayBill}&inv_no=${invNo}&cw_weight=${weight}&pack_pall=${pallet}&air_rate=${rate_THB}&dest_charge=${destChrage}&serv_charge=${servCharge}&repack_charge=${repackCharge}&other_chrage=${otherAmount}&net_amount=${netAmount}&create_by=${UpperUpdate_By}&create_date=${recDate}&update_by=${UpperUpdate_By}&update_date=${recDate}`
        )
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Save Successful",
            text: "Export Entry data has been saved successfully!",
            confirmButtonText: "OK",
          });
          handleClear();
        })
        .catch((error) => {
          console.error(`Error saving data:`, error.message);
          Swal.fire({
            icon: "error",
            title: "Save Failed",
            text: "An error occurred while saving. Please try again.",
            confirmButtonText: "OK",
          });
        });
      }
    });


    // console.log('ternDest:' , ternDest);
    // console.log('ternFac:' , ternFac);
    // console.log('flightName:' , flightName);
    // console.log('recDate:' , recDate);
    // console.log('shipDate:' , shipDate);;
    // console.log('certNo:' , certNo);;
    // console.log('airWayBill:' , airWayBill);;
    // console.log('invNo:' , invNo);;
    // console.log('weight:' , weight);
    // console.log('pallet:' , pallet);
    // console.log('rate_THB:' , rate_THB);
    // console.log('destChrage:' , destChrage);
    // console.log('servCharge:' , servCharge);
    // console.log('repackCharge:' , repackCharge);
    // console.log('otherAmount:' , otherAmount);
    // console.log('netAmount:' , netAmount);
    // console.log('::::::::::::::::::');
  }

  const handleTermFacChange = (event, newValue) => {
    setSelectedTermFac(newValue);
    setSelectedInvNo(null);
    setSelectedFlightName('');
    setSelectedWeight('');
    setSelectedPallet('');
  }

  const handleFlightNameChange = (event, newValue) => {
    setSelectedFlightName(newValue);

    // setSelectedAirWayBill('');
    // setSelectedCertNo('');
    // setSelectedInvNo('');
    setSelectedWeight('');
    setSelectedPallet('');
    setRatefob(null);
    setRateTHB(null);
    setRatePallet(null);
    setTotalAir(null);
    setTotalAll(null);
    setTotalAllIn(null);
  }

  const handleDestChargeChange = (event, newValue) => {
    setSelectedDestCharge(newValue);
    fetchRateKg();
  }

  useEffect(() => {
    fetchTermDest();
    fetchTermFac();
    fetchFlightName();
    const termDest = selectedTermDest?.term_dest || '';
    const termFac = selectedTermFac?.term_fac || '';
    const destCharge = selectedDestCharge?.min_charge || '';

    if (termDest !== '' && termFac !== '') {
      fetchDestChargeOptions();
    }
    if (termDest !== '' && termFac !== '' && destCharge !== '') {
      fetchRateKg();
    }
  }, [selectedTermDest, selectedTermFac, selectedDestCharge]);

  const handleSearchRate = () => {
    const termDest = selectedTermDest?.term_dest || '';
    const termFac = selectedTermFac?.term_fac || '';
    const flightNamr = selectedFlightName?.flight_name || '';
    
    if (termDest !== '' && termFac !== '' && selectedInvNo !== '' && flightNamr !== '' && selectedWeight !== '') {
      const url = (`http://10.17.100.115:3001/api/smart_ship/filter-detail-for-cal-weight?term_dest=${termDest}&term_fac=${termFac}&flight_name=${flightNamr}`);
      axios.get(url)
      .then(response => {
        const data = response.data;
        let fob = 0;
        let min_charge = 0;
        let min_w = 0;
        let u45 = 0;
        let o45 = 0;
        let o100 = 0;
        let o300 = 0;
        let o500 = 0;
        let o1000 = 0;
        let ratePallet = 0;
        if (data && data.length > 0 && data[0]) {
          fob = data[0].fob;
          min_charge = data[0].min_charge;
          min_w = data[0].min_w;
          u45 = data[0].rate_under_45;
          o45 = data[0].rate_over_45;
          o100 = data[0].rate_over_100;
          o300 = data[0].rate_over_300;
          o500 = data[0].rate_over_500;
          o1000 = data[0].rate_over_1000;
          ratePallet = data[0].rate_pallet;

          if (selectedWeight <= min_w) {
            setRateTHB('');
            setSelectedMinAir(min_charge);
            setSelectedRemarkAir('Weight less than minimum weight');
          } else if (selectedWeight > min_w && selectedWeight <= 45) {
            setSelectedRemarkAir('');
            setRateTHB(u45);
          } else if (selectedWeight > 45 && selectedWeight <= 100) {
            setSelectedRemarkAir('');
            setRateTHB(o45);
          } else if (selectedWeight > 100 && selectedWeight <= 300) {
            setSelectedRemarkAir('');
            setRateTHB(o100);
          } else if (selectedWeight > 300 && selectedWeight <= 500) {
            setSelectedRemarkAir('');
            setRateTHB(o300);
          } else if (selectedWeight > 500 && selectedWeight <= 1000) {
            setSelectedRemarkAir('');
            setRateTHB(o500);
          } else if (selectedWeight > 1000){
            setSelectedRemarkAir('');
            setRateTHB(o1000);
          }
          setRatePallet(ratePallet);
          setRatefob(fob);
        }
      })
    }
  }

  useEffect(() => {
    handleSearchRate();
  }, [selectedTermDest, selectedTermFac, selectedInvNo, selectedFlightName, selectedWeight, selectedPallet, recDate, ]);

  const formatNumber = (value) => {
    if (!value || value === '' || isNaN(value)) return '';
    return Number(value).toLocaleString();
  };

   const handleDateChange = (newValue) => {
      setSelectedDate(newValue);
  }


  // Add these handler functions
  const handleCertNoChange = (newValue) => {
    setSelectedCertNo(newValue);
  }

  const handleAirWayBillChange = (newValue) => {
    setSelectedAirWayBill(newValue);
  }

  // Add this handler function with your other handlers (around line 350)
  const handleShipDateChange = (newValue) => {
    setSelectedShipDate(newValue);

    const shipDate = newValue? dayjs(newValue).format('DD/MM/YYYY') : null;
    console.log('shipDate:' , shipDate)
    const url = (`http://10.17.100.115:3001/api/smart_ship/filter-inv-no-list?ship_date=${shipDate}`);
      axios.get(url)
      .then(response => {
        const data = response.data;
        setDistinctInvNo(data)
      })
  }

  // Add this handler function with your other handlers
  const handleOtherAmountChange = (newValue) => {
    const numericValue = newValue === '' ? '' : Number(newValue);
    setSelectedOtherAmount(numericValue)
    handleCalculateAmount(numericValue);
  };

  const handleCalculateAmount = (otherAmountOverride = null) => {
    let sumTotalAir = rateTHB * selectedWeight;
    let sumRePack = ratePallet * selectedPallet;
    let chkDest = distinctDestCharge[0]?.min_charge; 
    // Use the override value if provided, otherwise use state
    let OtherAmount = otherAmountOverride !== null ? Number(otherAmountOverride) : Number(selectedOtherAmount);

    if(chkDest === 0){
      if (selectedRemarkAir === '' && rateTHB > 0) {
        let sumTotalAll = (sumTotalAir + ratefob + sumRePack + OtherAmount) ;
        setTotalAll(sumTotalAll);
      } else if (rateTHB === 0) {
        setTotalAll(null);
      } else {
        let sumTotalAll = (selectedMinAir + ratefob + sumRePack + OtherAmount) ;
        setTotalAll(sumTotalAll);
      }
    } else {
      console.log('totalAllIn', totalAllIn);
      if (totalAllIn === null) {
        Swal.fire({
          icon: 'warning',
          title: 'DESTINATION CHARGE',
          text: 'Please select destination charge.',
        });
        setSelectedOtherAmount('')
        return;
      } else {
        let sumTotalAir = rateTHB * selectedWeight;
        let sumRePack = ratePallet * selectedPallet;
        let sumAllin = 0
        // let min_charge = selectedDestCharge.min_charge;

        // let averageKg = 0;
        // if (min_charge > 0) {
        //   averageKg = (min_charge / distinctRateKg).toFixed(2);
        //   if(selectedWeight > averageKg){
        //     sumAllin = distinctRateKg * selectedWeight;
        //   } else {
        //     sumAllin = min_charge;
        //   }
        //   setTotalAllIn(sumAllin);
        // }

        if (selectedRemarkAir === '' && rateTHB > 0) {
          console.log('DEST1');
          let sumTotalAll = (sumTotalAir + ratefob + sumRePack + totalAllIn + OtherAmount) ;
          setTotalAll(sumTotalAll);
        } else if (rateTHB === 0) {
          console.log('DEST2');
          setTotalAll(null);
        } else {
          console.log('DEST3');
          let sumTotalAll = (selectedMinAir + ratefob + sumRePack + totalAllIn + OtherAmount) ;
          setTotalAll(sumTotalAll);
        }
      }
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDateModalChange = async (date) => {
    setSelectedDate(date);
    const response = await axios.get(`/api/data?date=${date.toISOString().split('T')[0]}`);
    setFilteredData(response.data);
  };

  return (
    <>
      <Navbar onToggle={handleNavbarToggle}/>
      <Box marginLeft={isNavbarOpen ? "220px" : 3} marginTop={10}>
        <Box sx={{height: 80 , marginTop: '20px' , marginLeft: '60px'}}>
          <Card 
            elevation={8} 
            sx={{ 
              // maxWidth: 1530, 
              width: '85%',
              margin: '0', 
              borderRadius: 3,
              height: 370,
              // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
              padding: 2,
              marginBottom: 3
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              {/* Header Section */}
              <Box sx={{ 
                textAlign: 'center', 
                marginBottom: 1,
                padding: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                height: 60,
                backdropFilter: 'blur(10px)'
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    marginBottom: 1
                  }}
                >
                  🚢 CHARGE DOUBLE WEIGHT CALCULATOR
                </Typography>
                {/* <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontStyle: 'italic'
                  }}
                >
                  Calculate shipping costs with precision and ease
                </Typography> */}
              </Box>

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
                  Shipping Details
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' },
                  gap: 3,
                  alignItems: 'center'
                }}>
                  
                  {/* Trade Term Dest */}
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
                        label="🌍 TRADE TERM DEST"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
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
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option && value && option.term_dest === value.term_dest
                    }
                  />

                  {/* Date Picker with Icon */}
                  <Box sx={{ position: 'relative' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        label="📅 REC. DATE" 
                        size="small"
                        value={selectedDate}
                        onChange={(newDate) => handleDateChange(newDate)}
                        format="DD/MM/YYYY"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
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

                  {/* Factory */}
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
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option && value && option.term_fac === value.term_fac
                    }
                  />

                  {/* Flight Name */}
                  <Autocomplete
                    disablePortal
                    size="small"
                    options={distinctFlightName}
                    getOptionLabel={(option) => option?.flight_name || ''}
                    value={selectedFlightName}
                    onChange={handleFlightNameChange}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="✈️ FLIGHT NAME"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
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
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option && value && option.flight_name === value.flight_name
                    }
                  />

                  {/* Ship Date Picker */}
                  <Box sx={{ position: 'relative' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        label="🚢 SHIP DATE" 
                        size="small"
                        value={selectedShipDate}
                        onChange={(newDate) => handleShipDateChange(newDate)}
                        format="DD/MM/YYYY"
                        sx={{ 
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
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
                </Box>
              </Paper>

              {/* Second Row - Input Fields */}
              <Paper 
                elevation={4} 
                sx={{ 
                  padding: 1, 
                  borderRadius: 2,
                  height: 115,
                  background: 'linear-gradient(145deg, #f7fafc, #edf2f7)',
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
                  <ReceiptIcon color="secondary" />
                  Order Information
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' },
                  gap: 3,
                  alignItems: 'center'
                }}>

                  {/* Certificate Number */}
                  <TextField
                    value={selectedCertNo}
                    size="small"
                    variant="outlined"
                    label="📜 Export Entry"
                    placeholder="Enter Export Entry No."
                    onChange={(e) => handleCertNoChange(e.target.value.toUpperCase())}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        },
                        '& input': {
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          color: '#3182ce',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  />

                  {/* Air Way Bill */}
                  <TextField
                    value={selectedAirWayBill}
                    size="small"
                    variant="outlined"
                    label="✈️ Air Way Bill"
                    placeholder="Enter Air Way Bill"
                    onChange={(e) => handleAirWayBillChange(e.target.value.toUpperCase())}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        },
                        '& input': {
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          color: '#3182ce',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  />

                  {/* Invoice Number */}
                  <Autocomplete
                    multiple
                    disablePortal
                    // freeSolo
                    id="combo-box-demo-product"
                    size="small"
                    options={distinctInvNo}
                    getOptionLabel={(option) => option && option.inv_no}
                    value={selectedInvNo || []} // Use the state value, not the handler
                    onChange={(event, newValue) => handleInvNoChange(newValue)} // Pass the event and newValue
                    sx={{ width: 500, backgroundColor: 'white', }}
                    renderInput={(params) => (
                      <TextField {...params} label="📋 Invoice" />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option && value && option.inv_no === value.inv_no
                    }
                  />

                  
                  {/* <TextField
                    value={selectedInvNo}
                    size="small"
                    variant="outlined"
                    label="📋 Invoice"
                    placeholder="Enter Invoice No."
                    onChange={(e) => handleInvNoChange(e.target.value.toUpperCase())}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        },
                        '& input': {
                          textAlign: 'center',
                          textTransform: 'uppercase',
                          color: '#3182ce',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  /> */}

                  {/* Weight */}
                  <TextField
                    // value={selectedWeight}
                    value={selectedWeight || ''}
                    size="small"
                    variant="outlined"
                    label="⚖️ Weight (KG)"
                    placeholder="Enter Weight"
                    type="number"
                    onChange={(e) => handleWeightChange(e.target.value)}
                    // InputLabelProps={{
                    //   shrink: selectedWeight !== '' && selectedWeight !== null, // Control label shrinking
                    // }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        },
                        '& input': {
                          textAlign: 'center',
                          color: '#3182ce',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  />

                  {/* Pallet */}
                  <TextField
                    // value={selectedPallet}
                    value={selectedPallet || ''}
                    size="small"
                    variant="outlined"
                    label="📦 Pallet Count"
                    placeholder="Enter Pallet"
                    type="number"
                    onChange={(e) => handlePalletChange(e.target.value)}
                    // InputLabelProps={{
                    //   shrink: selectedPallet !== '' && selectedPallet !== null, // Control label shrinking
                    // }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                        },
                        '& input': {
                          textAlign: 'center',
                          color: '#3182ce',
                          fontWeight: 'bold',
                        },
                      },
                    }}
                  />
                </Box>
              </Paper>
            </CardContent>
          </Card>
          
          <div style={{ height: 350, width: 1530, marginTop: 20, display: "flex", flexDirection: "row",}}>
            <div style={{ height: 365, width:1200, border: "solid black 1px" , backgroundColor: '#F1EFEC', boxShadow: '10px 10px 10px grey', borderRadius: 10, }}>
              <p style={{ fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <ReceiptIcon />
                FORM DETAIL CHECKING
              </p>
              <div style={{width:1200 , fontSize: 18, overflow: 'auto', marginTop: '5px', marginLeft: '10px', marginRight: '10px', }}>
                {isLoading ? (
                    <Custom_Progress />
                ) : (
                  <table style={{width: 1170, borderCollapse: 'collapse', tableLayout: 'fixed',}}>
                    <thead style={{fontSize: 18, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 1, }}>
                      <tr>
                        <th
                          style={{
                              textAlign: "center",
                              backgroundColor: "#4D55CC",
                              width: "200px",
                              border: 'solid white 1px',
                              color: 'white',
                              height: "50px",
                              fontWeight: 'bold',
                            }}
                          >
                          <InventoryIcon /> DESCRIPTION
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            backgroundColor: "#4D55CC",
                            width: "50px",
                            border: 'solid white 1px',
                            color: 'white',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                          💰 RATE
                        </th>
                        <th
                          style={{
                            
                            textAlign: "center",
                            backgroundColor: "#4D55CC",
                            width: "60px",
                            border: 'solid white 1px',
                            color: 'white',
                            height: "50px",
                            fontWeight: 'bold',
                          }}
                        >
                          <ScaleIcon /> WEIGHT [KG]
                        </th>
                        <th
                          style={{
                            
                              textAlign: "center",
                              backgroundColor: "#E0EDFF",
                              width: "50px",
                              border: 'solid black 1px',
                              color: 'black',
                              height: "50px",
                              fontWeight: 'bold',
                              minWidth: "50px",
                            }}
                          >
                          💵 TOTAL
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: 18, textAlign: 'center' }}>
                      <tr>
                        <td style={{width: '200px', border: 'solid black 1px', height: '40px', textAlign: 'left', paddingLeft: '10px'}}>
                          <FlightIcon sx={{ color: '#3b82f6', marginRight: '8px'}} />AIR FREIGHT / [*{selectedRemarkAir}*]
                        </td>
                        {/* <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue',}}>{selectedWeight && selectedWeight > 0 ? rateTHB : rateTHB}</td> */}
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue',}}>{(selectedWeight > 0 && rateTHB > 0) ? rateTHB : '-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue',}}>{selectedWeight> 0 ? selectedWeight : '-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', textAlign: 'right', paddingRight: '10px'}}>{totalAir > 0 ? formatNumber(totalAir): '-'}</td>
                      </tr>
                      <tr>
                        <td style={{width: '200px', border: 'solid black 1px', height: '40px', textAlign: 'left', paddingLeft: '10px'}}>
                          <LocationOnIcon sx={{ color: '#8b5cf6', marginRight: '8px' }} />DESTINATION CHARGE (DDU-DAP) / [{distinctRateKg}]
                        </td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', padding: '2px'}}>
                          <Autocomplete
                            disablePortal
                            size="small"
                            options={distinctDestCharge.filter(option => option.min_charge !== 0)}
                            getOptionLabel={(option) => {
                              if (!option?.min_charge) return '';
                              return Number(option.min_charge).toLocaleString();
                            }}
                            value={selectedDestCharge}
                            onChange={handleDestChargeChange}
                            sx={{ 
                              width: '100%', 
                              height: '35px',
                              '& .MuiOutlinedInput-root': {
                                height: '35px',
                                fontSize: 12,
                                backgroundColor: 'white',
                                border: '1px solid black',
                                
                                '& input': {
                                  textAlign: 'center',
                                  color: 'blue',
                                  padding: '0 !important',
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField {...params} variant="outlined" />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option && value && option.id === value.id
                            }
                          />
                        </td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', }}>{distinctDestCharge.filter(item => item.min_charge !== 0).length > 0 ? selectedWeight : '-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', textAlign: 'right', paddingRight: '10px' }}>{totalAllIn > 0 ? formatNumber(totalAllIn) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{width: '200px', border: 'solid black 1px', height: '40px', textAlign: 'left', paddingLeft: '10px'}}>
                          <ReceiptIcon sx={{ color: '#06b6d4', marginRight: '8px'}} />SERVICE CHARGE
                        </td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', }}>{selectedWeight > 0 ? ratefob : '-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', }}>{'-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', textAlign: 'right', paddingRight: '10px' }}>{selectedWeight && selectedWeight > 0 ? ratefob : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{width: '200px', border: 'solid black 1px', height: '40px', textAlign: 'left', paddingLeft: '10px'}}>
                          <InventoryIcon sx={{ color: '#f59e0b', marginRight: '8px'}} />DESTINATION RE-PACKING CHARGE
                        </td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', }}>{ratePallet > 0 ? ratePallet : '-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', }}>{selectedPallet > 0 ? selectedPallet : '-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', textAlign: 'right', paddingRight: '10px' }}>{ratePallet && selectedPallet > 0 ? formatNumber(ratePallet * selectedPallet) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{width: '200px', border: 'solid black 1px', height: '40px', textAlign: 'left', paddingLeft: '10px'}}>
                          <AltRouteIcon sx={{ color: '#0D5EA6', marginRight: '8px'}} />OTHER
                        </td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', padding: '2px'}}>
                          <TextField
                            value={selectedOtherAmount.toLocaleString()}
                            size="small"
                            variant="outlined"
                            // placeholder="0"
                            type="text"
                            onChange={(e) => handleOtherAmountChange(e.target.value)}
                            sx={{
                              width: '100%',
                              height: '35px',
                              '& .MuiOutlinedInput-root': {
                                height: '35px',
                                fontSize: 12,
                                backgroundColor: 'white',
                                border: '1px solid black',
                                borderRadius: 1,
                                '& input': {
                                  textAlign: 'center',
                                  color: 'blue',
                                  padding: '0 !important',
                                  fontWeight: 'bold',
                                },
                                '&:hover': {
                                  borderColor: '#3b82f6',
                                },
                                '&.Mui-focused': {
                                  borderColor: '#3b82f6',
                                  boxShadow: '0 0 0 1px #3b82f6',
                                }
                              },
                            }}
                          />
                        </td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', }}>{'-'}</td>
                        <td style={{width: '50px', backgroundColor:'#FEFAE0', border: 'solid black 1px', height: '40px', color: 'blue', textAlign: 'right', paddingRight: '10px' }}>{selectedOtherAmount > 0 ? formatNumber(selectedOtherAmount) : '-'}</td>
                      </tr>
                      <tr>
                        <td style={{width: '200px', height: '35px' }}></td>
                        <td style={{width: '50px', height: '35px' }}></td>
                        <td style={{width: '50px', backgroundColor:'#4DFFBE', border: 'solid black 1px', height: '40px', textAlign: 'right', fontWeight: 'bold'}}>💰 NET AMOUNT:</td>
                        <td style={{width: '50px', backgroundColor:'#4DFFBE', border: 'solid black 1px', height: '40px', textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', color: 'blue', textDecoration: selectedPallet !== '' ? 'underline double' : 'none',}}>{selectedPallet !== '' ? formatNumber(totalAll) : '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div style={{marginLeft: '40px',}}>
              <Button 
                className="btn_hover"
                onClick={handleClear}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '12px 12px 15px grey';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '10px 10px 10px grey';
                }}
                style={{
                    width: '250px',
                    height: '32%',
                    border: '1px solid black',
                    backgroundColor: '#FF9587',
                    borderRadius: 10,
                    boxShadow: '10px 10px 10px grey',
                  }}
              >
                <img src="/clear.png" alt="" style={{ width: 80, }} />
              </Button>
              <Button 
                className="btn_hover"
                onClick={handleSave}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '12px 12px 15px grey';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '10px 10px 10px grey';
                }}
                style={{
                    width: '250px',
                    height: '32%',
                    border: '1px solid black',
                    backgroundColor: '#91C8E4',
                    marginTop: '15px',
                    borderRadius: 10,
                    boxShadow: '10px 10px 10px grey',
                  }}
              >
                <img src="/save.png" alt="" style={{ width: 80, }} />
              </Button>
              <Button 
                className="btn_hover"
                onClick={handleOpen}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '12px 12px 15px grey';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '10px 10px 10px grey';
                }}
                style={{
                    width: '250px',
                    height: '32%',
                    border: '1px solid black',
                    background: '#FAEB92',
                    marginTop: '15px',
                    borderRadius: 10,
                    boxShadow: '10px 10px 10px grey',
                  }}
              >
                <img src="/edit.png" alt="" style={{ width: 60, }} />
              </Button>
              

            </div>
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="key-weight-modal-title"
            aria-describedby="key-weight-modal-description"
          >
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800 , height: 600 , background: 'linear-gradient(135deg, #F0F8FF 0%, #87CEFA  100%)' , boxShadow: 24, p: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' , height: 20 , marginBottom: 20}}>
                  <div style={{width: '100%' ,fontWeight: 'bold' , fontSize: 20 , textAlign: 'center' }}>
                      <label style={{color: ''}} htmlFor="" >EDIT DETAILS CHARGE DOUBLE WEIGHT</label>
                  </div>
                  <div>
                      <IconButton onClick={handleClose} style={{position: 'absolute', top: '10px', right: '10px',}}>
                          <CloseIcon style={{fontSize: '25px', color: 'white', backgroundColor: '#E55604'}} /> 
                      </IconButton>
                  </div>
              </div>
            </Box>
          </Modal>


        </Box>
      </Box>
    </>
  );
}