import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import {
  AccountBalance as BankIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useFormik, FieldArray, FormikProvider } from "formik";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const BankGuaranteeForm = () => {
  const formik = useFormik({
    initialValues:{
      bankDetails: [
        {
          bankName: "",
          branch: "",
          accountNumber: "",
          ifscCode: "",
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
        {/* BANK DETAILS */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <SectionHeader
              icon={<BankIcon />}
              title="Bank Account Details"
              subtitle="Add one or more bank accounts"
            />

            <FieldArray
              name="bankDetails"
              render={(arrayHelpers) => (
                <>
                  {formik.values.bankDetails.map((bank, index) => (
                    <Box
                      key={index}
                      sx={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 2,
                        p: 3,
                        mb: 3,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        Bank Account {index + 1}
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            label="Bank Name"
                            name={`bankDetails[${index}].bankName`}
                            value={bank.bankName}
                            onChange={formik.handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            label="Branch"
                            name={`bankDetails[${index}].branch`}
                            value={bank.branch}
                            onChange={formik.handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            label="Account Number"
                            name={`bankDetails[${index}].accountNumber`}
                            value={bank.accountNumber}
                            onChange={formik.handleChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            label="IFSC Code"
                            name={`bankDetails[${index}].ifscCode`}
                            value={bank.ifscCode}
                            onChange={formik.handleChange}
                          />
                        </Grid>

                        {formik.values.bankDetails.length > 1 && (
                          <Grid item xs={12}>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              Remove This Bank
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      arrayHelpers.push({
                        bankName: "",
                        branch: "",
                        accountNumber: "",
                        ifscCode: "",
                      })
                    }
                  >
                    Add Another Bank
                  </Button>
                </>
              )}
            />
          </CardContent>
        </Card>

      </Box>
    </FormikProvider>
  );
};

export default BankGuaranteeForm;
