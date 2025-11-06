import React from "react";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  MenuItem,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const PersonalInfoForm = () => {
  const formik = useFormik({
    initialValues: {
      nameOfMember: "",
      membershipNumber: "",
      nameOfFather: "",
      nameOfMother: "",
      dateOfBirth: "",
      ageInYears: "",
      membershipDate: "",
      amountInCredit: "",
      gender: "",
      religion: "",
      maritalStatus: "",
      caste: "",
      phoneNo: "",
      alternatePhoneNo:"",
      emailId:"",
    },
    onSubmit: async (values, { resetForm }) => {
      console.log("Form submitted:", values);
      resetForm();
    },
  });

  useEffect(() => {
    if (formik.values.dateOfBirth) {
      const dob = new Date(formik.values.dateOfBirth);
      const today = new Date();

      let years = today.getFullYear() - dob.getFullYear();
      let months = today.getMonth() - dob.getMonth();

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const ageString = `${years} years, ${months} months`;
      formik.setFieldValue("ageInYears", ageString);
    } else {
      formik.setFieldValue("ageInYears", "");
    }
  }, [formik.values.dateOfBirth]);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 4 }}>
        <SectionHeader
          icon={<PersonIcon />}
          title="Personal Information"
          subtitle="Basic member details and identification"
        />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Name of Member */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Name of Member"
                name="nameOfMember"
                value={formik.values.nameOfMember}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Name of Father */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Name of Father"
                name="nameOfFather"
                value={formik.values.nameOfFather}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Name of Mother */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Name of Mother"
                name="nameOfMother"
                value={formik.values.nameOfMother}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                InputLabelProps={{ shrink: true }}
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Age in Years (auto-calculated) */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Age in Years"
                name="ageInYears"
                value={formik.values.ageInYears}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Gender */}
            <Grid size={{xs:6, sm:6, md:2}}>
              <StyledTextField
                select
                label="Gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Religion */}
            <Grid size={{xs:6, sm:6, md:2}}>
              <StyledTextField
                select
                label="Religion"
                name="religion"
                value={formik.values.religion}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Select Religion</MenuItem>
                <MenuItem value="Hindu">Hinduism</MenuItem>
                <MenuItem value="Muslim">Islam</MenuItem>
                <MenuItem value="Christian">Christianity</MenuItem>
                <MenuItem value="Sikh">Sikhism</MenuItem>
                <MenuItem value="Buddhist">Buddhism</MenuItem>
                <MenuItem value="Jain">Jainism</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Marital Status */}
            <Grid size={{xs:6, sm:6, md:2}}>
              <StyledTextField
                select
                label="Marital Status"
                name="maritalStatus"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Caste */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                select
                label="Caste"
                name="caste"
                value={formik.values.caste}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Select Caste</MenuItem>
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="OBC">Other Backward Classes (OBC)</MenuItem>
                <MenuItem value="SC">Scheduled Caste (SC)</MenuItem>
                <MenuItem value="ST">Scheduled Tribe (ST)</MenuItem>
              </StyledTextField>
            </Grid>

            {/* Membership Number */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Membership No."
                name="membershipNumber"
                value={formik.values.membershipNumber}
                onChange={formik.handleChange}
              />
            </Grid>


            {/* Membership Date */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Membership Date"
                type="date"
                name="membershipDate"
                InputLabelProps={{ shrink: true }}
                value={formik.values.membershipDate}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Amount in Credit */}
            <Grid size={{xs:6, sm:6, md:3}}>
              <StyledTextField
                label="Amount in Credit"
                type="number"
                name="amountInCredit"
                value={formik.values.amountInCredit}
                onChange={formik.handleChange}
              />
            </Grid>

            
            <Grid size={{xs:6, sm:6, md:3}}>
                <StyledTextField
                    label="Phone Number"
                    name="phoneNo"
                    value={formik.values.phoneNo}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid size={{xs:6, sm:6, md:3}}>
                <StyledTextField
                    label="Alternet Phone Number"
                    name="alternetPhoneNo"
                    value={formik.values.alternetPhoneNo}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid size={{xs:6, sm:6, md:3}}>
                <StyledTextField
                    label="Email Id"
                    name="emailId"
                    type="email"
                    value={formik.values.emailId}
                    onChange={formik.handleChange}
                />
            </Grid>

          </Grid>

        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
