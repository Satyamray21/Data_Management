import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
} from "@mui/material";
import { Home as HomeIcon, UploadFile as UploadFileIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const AddressForm = () => {
  const formik = useFormik({
    initialValues: {
      permanentAddress: {
        flatHouseNo: "",
        areaStreetSector: "",
        locality: "",
        landmark: "",
        city: "",
        country: "",
        state: "",
        pincode: "",
        proofDocument: null,
      },
      sameAsPermanent: false,
      currentResidentialAddress: {
        flatHouseNo: "",
        areaStreetSector: "",
        locality: "",
        landmark: "",
        city: "",
        country: "",
        state: "",
        pincode: "",
        proofDocument: null,
      },
    },
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  //  Copy current → permanent when checked
  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    formik.setFieldValue("sameAsPermanent", checked);
    if (checked) {
      formik.setFieldValue(
        "permanentAddress",
        { ...formik.values.currentResidentialAddress }
      );
    } else {
      formik.setFieldValue("permanentAddress", {
        flatHouseNo: "",
        areaStreetSector: "",
        locality: "",
        landmark: "",
        city: "",
        country: "",
        state: "",
        pincode: "",
        proofDocument: null,
      });
    }
  };

  // ✅ Handle file upload
  const handleFileUpload = (prefix, file) => {
    formik.setFieldValue(`${prefix}.proofDocument`, file);
  };

  const renderAddressFields = (prefix, values) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Flat No. / House No. / Building"
          name={`${prefix}.flatHouseNo`}
          value={values.flatHouseNo}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Area / Street / Sector"
          name={`${prefix}.areaStreetSector`}
          value={values.areaStreetSector}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Locality"
          name={`${prefix}.locality`}
          value={values.locality}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Landmark"
          name={`${prefix}.landmark`}
          value={values.landmark}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="City"
          name={`${prefix}.city`}
          value={values.city}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Country"
          name={`${prefix}.country`}
          value={values.country}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="State"
          name={`${prefix}.state`}
          value={values.state}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledTextField
          label="Pincode"
          name={`${prefix}.pincode`}
          value={values.pincode}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/[^0-9]/g, "");
            formik.setFieldValue(`${prefix}.pincode`, onlyNums);
          }}
          inputProps={{ maxLength: 6 }}
        />
      </Grid>

      {/* ✅ File Upload */}
      <Grid item xs={12}>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<UploadFileIcon />}
        >
          {values.proofDocument
            ? `Uploaded: ${values.proofDocument.name}`
            : "Upload Address Proof Document"}
          <input
            type="file"
            hidden
            accept="image/*,application/pdf"
            onChange={(e) => handleFileUpload(prefix, e.target.files[0])}
          />
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 4 }}>
        <SectionHeader
          icon={<HomeIcon />}
          title="Address"
          subtitle="Residential information and references"
        />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {/* Current Residential Address FIRST */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  px: 2,
                  py: 1,
                  mb: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Current Residential Address
                </Typography>
              </Box>

              {renderAddressFields(
                "currentResidentialAddress",
                formik.values.currentResidentialAddress
              )}
            </Grid>

            {/* Permanent Address */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  px: 2,
                  py: 1,
                  mb: 2,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Permanent Address
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.sameAsPermanent}
                      onChange={handleSameAddress}
                      sx={{ color: "white" }}
                    />
                  }
                  label="Same as Current Address"
                  sx={{
                    color: "#fff",
                    "& .MuiFormControlLabel-label": { fontSize: "0.9rem" },
                  }}
                />
              </Box>

              {renderAddressFields(
                "permanentAddress",
                formik.values.permanentAddress
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
