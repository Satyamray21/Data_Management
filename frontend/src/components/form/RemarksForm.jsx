import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import {
  Comment as RemarksIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const RemarksForm = () => {
  const formik = useFormik({
    initialValues: {
      remarks: [
        {
          loanAmount: "",
          purposeOfLoan: "",
          loanDate: "",
        },
      ],
    },
    onSubmit: (values) => {
      console.log("Remarks Submitted:", values);
    },
  });

  //  Add another loan
  const handleAddAnotherLoan = () => {
    formik.setFieldValue("remarks", [
      ...formik.values.remarks,
      { loanAmount: "", purposeOfLoan: "", loanDate: "" },
    ]);
  };

  //  Delete loan
  const handleDeleteLoan = (index) => {
    const updated = formik.values.remarks.filter((_, i) => i !== index);
    formik.setFieldValue("remarks", updated);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 4 }}>
        <SectionHeader
          icon={<RemarksIcon />}
          title="Final Remarks & Additional Information"
          subtitle="Complete the member dossier"
        />

        <form onSubmit={formik.handleSubmit}>
          {formik.values.remarks.map((loan, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
            >
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Loan Amount */}
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="Loan Amount"
                    type="number"
                    name={`remarks[${index}].loanAmount`}
                    value={loan.loanAmount}
                    onChange={formik.handleChange}
                  />
                </Grid>

                {/* Purpose of Loan */}
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="Purpose of Loan"
                    name={`remarks[${index}].purposeOfLoan`}
                    value={loan.purposeOfLoan}
                    onChange={formik.handleChange}
                  />
                </Grid>

                {/* Loan Date */}
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="Loan Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    name={`remarks[${index}].loanDate`}
                    value={loan.loanDate}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              {/* Delete Button */}
              {formik.values.remarks.length > 1 && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ borderRadius: 2, px: 3 }}
                    onClick={() => handleDeleteLoan(index)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          ))}

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 2, px: 3 }}
              onClick={handleAddAnotherLoan}
              type="button"
            >
              Add Another Loan
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default RemarksForm;
