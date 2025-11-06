import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Badge as BadgeIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const IdentityVerificationForm = () => {
  const formik = useFormik({
    initialValues: {
      passportSizePhoto: null,
      passportSizePreview: "",

      panNumber: "",
      panCardPhoto: null,
      panCardPreview: "",

      aadhaarCardNumber: "",
      aadhaarFrontPhoto: null,
      aadhaarBackPhoto: null,
      aadhaarFrontPreview: "",
      aadhaarBackPreview: "",

      rationCardNumber: "",
      rationFrontPhoto: null,
      rationBackPhoto: null,
      rationFrontPreview: "",
      rationBackPreview: "",

      drivingLicenseNumber: "",
      drivingFrontPhoto: null,
      drivingBackPhoto: null,
      drivingFrontPreview: "",
      drivingBackPreview: "",

      voterIdNumber: "",
      voterFrontPhoto: null,
      voterBackPhoto: null,
      voterFrontPreview: "",
      voterBackPreview: "",

      passportNumber: "",
      passportPhoto: null,
      passportPreview: "",
    },
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
  });

  // 🔹 Generic file upload handler
  const handleFileUpload = (fieldFile, fieldPreview, e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      formik.setFieldValue(fieldFile, file);
      formik.setFieldValue(fieldPreview, preview);
    }
  };

  // 🔹 Helper component for file + preview (FULL IMAGE DISPLAY)
  const UploadBox = ({ label, fileField, previewField }) => (
    <Box sx={{ textAlign: "center" }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        fullWidth
        sx={{
          mt: 1,
          borderRadius: 2,
          border: "2px dashed #667eea",
          backgroundColor: "#f0f4ff",
          "&:hover": {
            backgroundColor: "#e0e7ff",
            border: "2px dashed #5a67d8",
          },
        }}
      >
        {formik.values[fileField]
          ? `Uploaded: ${formik.values[fileField].name}`
          : label}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFileUpload(fileField, previewField, e)}
        />
      </Button>

      {formik.values[previewField] && (
        <Box
          component="img"
          src={formik.values[previewField]}
          alt={label}
          sx={{
            mt: 2,
            width: "100%",
            maxWidth: 220,
            height: 140,
            objectFit: "contain", 
            borderRadius: 2,
            border: "2px solid #667eea",
            boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
            backgroundColor: "#fff",
          }}
        />
      )}
    </Box>
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 4 }}>
          <SectionHeader
            icon={<BadgeIcon />}
            title="Identity Verification"
            subtitle="Fill in document details and upload proof photos"
          />

          {/* 🔹 Passport Size Photo */}
          <Grid container spacing={3} sx={{ mt: 2 }} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight={600}>
                Passport Size Photo
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <UploadBox
                label="Upload Passport Size Photo"
                fileField="passportSizePhoto"
                previewField="passportSizePreview"
              />
            </Grid>
          </Grid>

          {/* 🔹 PAN Card */}
          <Grid container spacing={3} sx={{ mt: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="PAN Number"
                name="panNumber"
                value={formik.values.panNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <UploadBox
                label="Upload PAN Card Photo"
                fileField="panCardPhoto"
                previewField="panCardPreview"
              />
            </Grid>
          </Grid>

          {/* 🔹 Aadhaar Card */}
          <Grid container spacing={3} sx={{ mt: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Aadhaar Number"
                name="aadhaarCardNumber"
                value={formik.values.aadhaarCardNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Aadhaar Front Photo"
                fileField="aadhaarFrontPhoto"
                previewField="aadhaarFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Aadhaar Back Photo"
                fileField="aadhaarBackPhoto"
                previewField="aadhaarBackPreview"
              />
            </Grid>
          </Grid>

          {/* 🔹 Ration Card */}
          <Grid container spacing={3} sx={{ mt: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Ration Card Number"
                name="rationCardNumber"
                value={formik.values.rationCardNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Ration Front Photo"
                fileField="rationFrontPhoto"
                previewField="rationFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Ration Back Photo"
                fileField="rationBackPhoto"
                previewField="rationBackPreview"
              />
            </Grid>
          </Grid>

          {/* 🔹 Driving License */}
          <Grid container spacing={3} sx={{ mt: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Driving License Number"
                name="drivingLicenseNumber"
                value={formik.values.drivingLicenseNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload DL Front Photo"
                fileField="drivingFrontPhoto"
                previewField="drivingFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload DL Back Photo"
                fileField="drivingBackPhoto"
                previewField="drivingBackPreview"
              />
            </Grid>
          </Grid>

          {/* 🔹 Voter ID */}
          <Grid container spacing={3} sx={{ mt: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Voter ID Number"
                name="voterIdNumber"
                value={formik.values.voterIdNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Voter ID Front Photo"
                fileField="voterFrontPhoto"
                previewField="voterFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Voter ID Back Photo"
                fileField="voterBackPhoto"
                previewField="voterBackPreview"
              />
            </Grid>
          </Grid>

          {/* 🔹 Passport */}
          <Grid container spacing={3} sx={{ mt: 3 }} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Passport Number"
                name="passportNumber"
                value={formik.values.passportNumber}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <UploadBox
                label="Upload Passport Photo"
                fileField="passportPhoto"
                previewField="passportPreview"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default IdentityVerificationForm;
