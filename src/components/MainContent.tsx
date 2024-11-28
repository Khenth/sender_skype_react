import * as React from "react";
import Box from "@mui/material/Box";
import CardMui from "@mui/material/Card";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Alert,
  Badge,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { CustomTextField } from "./CustomTextField";
import { Formik } from "formik";
import { object, string } from "yup";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { ErrorMessage, useSender } from "../hooks";
import { DraggableFile } from "./DraggableFile";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface FormValues {
  user: string;
  password: string;
  message: string;
}

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
      />
    </React.Fragment>
  );
}

export default function MainContent() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [listDetails, setListDetails] = useState<ErrorMessage[]>([]);
  const { useSendMessage, useDownloadTemplate, loading } = useSender();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [file, setFile] = React.useState<File | undefined>();
  const [image, setImage] = React.useState<File | undefined>();
  const [message, setMessage] = React.useState<string | undefined>();

  const onSubmit = async (data: FormValues) => {
    if (!file) {
      setMessage('No tienes cargo el directorio de destinatarios "excel"');
      return;
    }

    setMessage(undefined);
    const { message, details, status } = await useSendMessage({
      ...data,
      file: file!,
      image,
    });

    if (status == "failure") {
      setMessage(message);
      setListDetails(details);
    }

    setFile(undefined);
    setImage(undefined);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {loading ? (
        <CardMui
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <GradientCircularProgress />
          <Box sx={{marginLeft:'5rem'}}>
          <Typography variant="h6" >Procesando.....</Typography>
          <Typography variant="inherit" >Esto puede tomar varios segundos.</Typography>
          <Typography variant="inherit" >Espere por favor.</Typography>

          </Box>
        </CardMui>
      ) : (
        <Formik<FormValues>
          enableReinitialize={true}
          initialValues={{
            user: "",
            password: "",
            message: "",
          }}
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={object<FormValues>({
            user: string()
              // .email("Correo invalido")
              .required("Correo o usuario requerido"),
            password: string().required("Password requerido"),
            message: string().required("Mesaje requerido"),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            handleBlur,
          }) => (
            <form onSubmit={handleSubmit}>
              <CardMui
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  backgroundColor: theme.palette.background.default,
                  padding: "1rem",
                }}
              >
                <Box marginBottom="1rem">
                  <IconButton
                    color="primary"
                    sx={{
                      border: `1px solid ${theme.palette.primary.light}`,
                      marginRight: "0.5rem",
                    }}
                    onClick={
                      listDetails.length > 0 ? handleClickOpen : undefined
                    }
                  >
                    <Badge badgeContent={listDetails.length} color="primary">
                      <ManageSearchIcon />
                    </Badge>
                  </IconButton>
                  <Button
                    sx={{ width: "10rem", marginRight: "0.5rem" }}
                    variant="outlined"
                    endIcon={<VerticalAlignBottomIcon />}
                    onClick={() => useDownloadTemplate()}
                  >
                    Plantilla
                  </Button>
                  <Button
                    sx={{ width: "10rem" }}
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                  >
                    Enviar
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    gap: 2,
                  }}
                >
                  {message && <Alert severity="warning">{message}</Alert>}
                  <CustomTextField
                    label="Correo o Usuario Skype"
                    id="user"
                    name="user"
                    value={values.user}
                    onChange={handleChange}
                    helperText={touched.user && errors.user}
                    error={touched.user && errors.user != null}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment  position="end">
                          <AccountCircleIcon  color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CustomTextField
                    label="Password"
                    type={!showPassword ? "password" : undefined}
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    helperText={touched.password && errors.password}
                    error={touched.password && errors.password != null}
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOffOutlined />
                            ) : (
                              <VisibilityOutlined />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Divider>
                    <Typography variant="inherit">
                      Directorio de envio
                    </Typography>
                  </Divider>
                  <DraggableFile
                    file={file}
                    onSelectFile={(f) => setFile(f)}
                    accept=".xlsx"
                  />
                  <Divider>
                    <Typography variant="inherit">
                      {"Adjunta Imagen (Opcional)"}
                    </Typography>
                  </Divider>
                  <DraggableFile
                    file={image}
                    onSelectFile={(img) => setImage(img)}
                    accept="image/png, image/jpeg"
                  />

                  <CustomTextField
                    label="Mensaje"
                    type="message"
                    id="message"
                    name="message"
                    placeholder="Ingresa aqui un mensaje....."
                    value={values.message}
                    onChange={handleChange}
                    helperText={touched.message && errors.message}
                    error={touched.message && errors.message != null}
                    onBlur={handleBlur}
                    multiline
                  />
                </Box>
              </CardMui>
            </form>
          )}
        </Formik>
      )}
      <Dialog
        maxWidth="md"
        sx={{ padding: "5rem" }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Log del archivo</DialogTitle>
        <TableContainer component={Paper} sx={{ padding: "2rem" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    border: `1px solid ${theme.palette.text.secondary}`,
                  }}
                >
                  Contact
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    border: `1px solid ${theme.palette.text.secondary}`,
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    border: `1px solid ${theme.palette.text.secondary}`,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    border: `1px solid ${theme.palette.text.secondary}`,
                  }}
                >
                  Error
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDetails.map((row, index) => (
                <TableRow
                  key={index}
                  sx={
                    {
                      // "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
                      // "&:hover": { backgroundColor: "#eeeeee" },
                    }
                  }
                >
                  <TableCell
                    sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
                  >
                    {row.contact}
                  </TableCell>
                  <TableCell
                    sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: row.status === "failure" ? "#d32f2f" : "#388e3c",
                      border: `1px solid ${theme.palette.text.secondary}`,
                    }}
                  >
                    {row.status}
                  </TableCell>
                  <TableCell
                    sx={{ border: `1px solid ${theme.palette.text.secondary}` }}
                  >
                    {row.error}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </Box>
  );
}
