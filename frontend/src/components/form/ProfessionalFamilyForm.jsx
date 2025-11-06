import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import {
  Work as WorkIcon,
  FamilyRestroom as FamilyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const ProfessionalFamilyForm = () => {
  const formik = useFormik({
    initialValues: {
      qualification: "",
      occupation: "",
      familyMemberMemberOfSociety: false,
      familyMembers: [
        {
          name: "",
          membershipNo: "",
        },
      ],
    },
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <Box component="form" onSubmit={formik.handleSubmit}>

        {/* PROFESSIONAL BACKGROUND */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <SectionHeader
              icon={<WorkIcon />}
              title="Professional Background"
              subtitle="Educational and professional information"
            />

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Qualification"
                  name="qualification"
                  value={formik.values.qualification}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Occupation"
                  name="occupation"
                  value={formik.values.occupation}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* FAMILY INFORMATION */}
    
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <SectionHeader
              icon={<FamilyIcon />}
              title="Family Information"
              subtitle="Family members in society"
            />

            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="familyMemberMemberOfSociety"
                      checked={formik.values.familyMemberMemberOfSociety}
                      onChange={formik.handleChange}
                    />
                  }
                  label={
                    <Typography variant="body1">
                      Any family member a member of the society?
                    </Typography>
                  }
                />
              </Grid>

              {/* Conditionally render multiple members */}
              {formik.values.familyMemberMemberOfSociety && (
                <Grid item xs={12}>
                  <FieldArray
                    name="familyMembers"
                    render={(arrayHelpers) => (
                      <>
                        {formik.values.familyMembers.map((member, index) => (
                          <Grid
                            container
                            spacing={2}
                            key={index}
                            alignItems="center"
                            sx={{
                              backgroundColor: "#f9fafb",
                              borderRadius: 2,
                              p: 2,
                              mb: 2,
                            }}
                          >
                            <Grid item xs={12} sm={5}>
                              <StyledTextField
                                label="Family Member Name"
                                name={`familyMembers[${index}].name`}
                                value={member.name}
                                onChange={formik.handleChange}
                              />
                            </Grid>

                            <Grid item xs={12} sm={5}>
                              <StyledTextField
                                label="Membership Number"
                                name={`familyMembers[${index}].membershipNo`}
                                value={member.membershipNo}
                                onChange={formik.handleChange}
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              sm={2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              {formik.values.familyMembers.length > 1 && (
                                <IconButton
                                  color="error"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        ))}

                        {/* Add Member Button */}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() =>
                            arrayHelpers.push({ name: "", membershipNo: "" })
                          }
                        >
                          Add Another Member
                        </Button>
                      </>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </FormikProvider>
  );
};

export default ProfessionalFamilyForm;
