import React, { useState } from "react";
import { Button, TextField, InputAdornment, IconButton} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FujiLogo from "../assets/FujiLogo.png";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Swal from "sweetalert2";
import axios from "axios";
import "./styles/Login.css";
import { Link } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BackspaceIcon from '@mui/icons-material/Backspace';

function LoginNew() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [userLogin, setUserLogin] = useState("");
  const navigate = useNavigate();

  // const userDatabase = `http://10.17.100.115:3001/api/smart_planning/filter-user-login?user_login=${userLogin}`;
  const userDatabase = `http://10.17.100.115:3001/api/smart_ship/filter-user-login-smart-ship?user_login=${userLogin}`;


  const handleLogin = (event) => {
    event.preventDefault();

    axios
      .get(userDatabase)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (
          data[0].user_login === userLogin &&
          data[0].user_password === password
        ) {
          localStorage.setItem("userToken", JSON.stringify(data[0]));
          console.log("Logged in successfully");
          Swal.fire({
            icon: "success",
            title: "Login Success",
            text: "Welcome to Shipping & Logistics System",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/home");
        } else {
          console.log("Login failed");
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Please check your username or password or permission",
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the request:", error.message);
        Swal.fire({
          icon: "error",
          title: "User does not exist",
          text: "Please check your username or password or permission",
        });
      });
  };

  const handleGuest = () => {
    localStorage.setItem(
      "guestToken",
      JSON.stringify({
        user_login: "Guest",
        user_role: "Guest",
      })
    );
    Swal.fire({
      icon: "warning",
      title: "Guest Mode",
      text: "Guest mode for read only",
    });
  };

  const handleCancel = () => {
    setUserLogin("");
    setPassword("");
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <div className="login-bg">
      <div className="login-container">
        <img src="/ship-logo.png" alt="" className="login-logo"/>
        <p className="login-title"></p>
        <form onSubmit={handleLogin}>
          <TextField
            // label="Username"
            placeholder="USERNAME"
            variant="outlined"
            margin="normal"
            value={userLogin}
            onChange={(e) => setUserLogin(e.target.value)}
            autoComplete="username"
            fullWidth
            required
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#0d47a1' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#0d47a1',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0d47a1',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#42a5f5',
                  },
                },
              }}
              InputLabelProps={{
                sx: {
                  color: '#0d47a1',
                  '&.Mui-focused': {
                    color: '#42a5f5',
                  },
                },
            }}
          />
          <TextField
            // label="Password"
            placeholder="PASSWORD"
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#0d47a1' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: '#0d47a1' }} />
                    ) : (
                      <Visibility sx={{ color: '#0d47a1' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                color: '#0d47a1',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0d47a1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#42a5f5',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: '#0d47a1',
                '&.Mui-focused': {
                  color: '#42a5f5',
                },
              },
            }}
          />
          {/* <TextField
            label="Password"
            // placeholder="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
            required
            InputProps={{
              sx: {
                color: 'blue', // สีตัวอักษรภายในช่องกรอก
              },
            }}
          // InputLabelProps={{
          //   sx: {
          //     color: 'blue', // สีของ label (คำว่า Password)
          //   },
          // }}
          /> */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ flex: 1 }}
              disabled={loading}
            >
              Login <LockOpenOutlinedIcon sx={{ ml: 1 }} />
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleCancel}
              sx={{ flex: 1 }}
              style={{backgroundColor: '#E5E0D8', color: '#000'}}
              disabled={loading}
            >
              Cancel <BackspaceIcon sx={{ ml: 1 }} />
            </Button>
          </div>
        </form>
      </div>
      {/* SVG wave background */}
      {/* <svg className="login-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="#d0eaff"         // ฟ้าอ่อนมาก
          fillOpacity="1"
          d="M0,224 C360,320 1080,120 1440,224 L1440,320 L0,320 Z"
        />
        <path
          fill="#a6d8fa"         // ฟ้าอ่อน
          fillOpacity="0.8"
          d="M0,256 C480,320 960,160 1440,256 L1440,320 L0,320 Z"
        />
        <path
          fill="#7cc3f7"         // ฟ้ากลาง
          fillOpacity="0.7"
          d="M0,288 C600,340 840,180 1440,288 L1440,320 L0,320 Z"
        />
      </svg> */}
    </div>
  );
}

export default LoginNew;