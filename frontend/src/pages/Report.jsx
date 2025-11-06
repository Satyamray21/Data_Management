import React, { useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Formik, Form, Field } from "formik";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MissingMembersTable = () => {
    const members = [
        { memberNo: "M001", name: "Aarav Sharma", aadhaarNumber: "1234-5678-9012", panNumber: "ABCDE1234F", address: "Delhi", phone: "9999999999" },
        { memberNo: "M002", name: "Riya Gupta", aadhaarNumber: "", panNumber: "", address: "", phone: "8888888888" },
        { memberNo: "M003", name: "Karan Mehta", aadhaarNumber: "5678-9012-3456", panNumber: "", address: "Mumbai", phone: "" },
        { memberNo: "M004", name: "Priya Singh", aadhaarNumber: "9876-5432-1000", panNumber: "XYZAB6789C", address: "Pune", phone: "7777777777" },
        { memberNo: "M005", name: "Rahul Verma", aadhaarNumber: "", panNumber: "", address: "Bangalore", phone: "6666666666" },
    ];

    // ✅ PDF Generator Function
    const generateSimplePDF = (filteredMembers, selectedFields) => {
        try {
            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("Members Missing Details", 14, 15);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
            doc.text(`Total Members: ${filteredMembers.length}`, 14, 28);

            const fieldLabels = {
                aadhaarNumber: "Aadhar",
                panNumber: "PAN Card",
                address: "Address",
                phone: "Phone",
                passportNumber: "Passport Number"
            };

            // Dynamic PDF table
            const tableHead = ["Member No", "Name", ...selectedFields.map(f => fieldLabels[f])];
            const tableData = filteredMembers.map(m => [
                m.memberNo,
                m.name,
                ...selectedFields.map(f => m[f] || "Missing")
            ]);

            autoTable(doc, {
                startY: 40,
                head: [tableHead],
                body: tableData,
                styles: { fontSize: 9 },
                headStyles: { fillColor: [25, 118, 210], textColor: 255, fontStyle: "bold" },
            });

            // Smart filename
            const fileName = `Missing_${selectedFields.map(f => fieldLabels[f].replace(/\s+/g, "")).join("_")}_Members.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    const defaultFields = ["aadhaarNumber", "panNumber", "address", "phone", "passportNumber"];

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
                Members Missing Details
            </Typography>

            <Formik
                initialValues={{
                    search: "",
                    missingFields: defaultFields,
                }}
                onSubmit={() => { }}
            >
                {({ values, setFieldValue }) => {
                    // Filter members missing selected fields
                    const missingMembers = useMemo(() => {
                        return members.filter((m) =>
                            values.missingFields.some((field) => !m[field]?.trim())
                        );
                    }, [members, values.missingFields]);

                    // Search filter
                    const filteredMembers = useMemo(() => {
                        const q = values.search.toLowerCase();
                        return missingMembers.filter(
                            (member) =>
                                member.name.toLowerCase().includes(q) ||
                                member.memberNo.toLowerCase().includes(q)
                        );
                    }, [missingMembers, values.search]);

                    const handleCheckboxChange = (field) => {
                        const updated = values.missingFields.includes(field)
                            ? values.missingFields.filter((f) => f !== field)
                            : [...values.missingFields, field];
                        setFieldValue("missingFields", updated);
                    };

                    const fieldLabels = {
                        aadhaarNumber: "Aadhar",
                        panNumber: "PAN Card",
                        address: "Address",
                        phone: "Phone",
                        passportNumber: "Passport Number"
                    };

                    return (
                        <Form>
                            {/* 🔍 Search and PDF Download */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                                    <Field
                                        as={TextField}
                                        name="search"
                                        variant="outlined"
                                        placeholder="Search by Member No or Name"
                                        size="small"
                                        sx={{ width: "100%", maxWidth: 400 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<PictureAsPdfIcon />}
                                        disabled={filteredMembers.length === 0}
                                        onClick={() => generateSimplePDF(filteredMembers, values.missingFields)} // ✅ Fixed
                                    >
                                        Download PDF
                                    </Button>
                                </Box>

                                {/* ✅ Missing Fields Selection */}
                                <FormGroup row sx={{ flexWrap: "wrap" }}>
                                    {Object.entries(fieldLabels).map(([key, label]) => (
                                        <FormControlLabel
                                            key={key}
                                            control={
                                                <Checkbox
                                                    checked={values.missingFields.includes(key)}
                                                    onChange={() => handleCheckboxChange(key)}
                                                />
                                            }
                                            label={label}
                                        />
                                    ))}
                                </FormGroup>
                            </Box>

                            {/* 📊 Summary */}
                            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                                Showing {filteredMembers.length} of {missingMembers.length} members with missing details
                            </Typography>

                            {/* 🧾 Dynamic Table */}
                            {filteredMembers.length === 0 ? (
                                <Typography
                                    color={missingMembers.length === 0 ? "green" : "text.secondary"}
                                    sx={{ mt: 2, p: 2, textAlign: "center" }}
                                >
                                    {missingMembers.length === 0
                                        ? "✅ All members have complete details!"
                                        : "No members found matching your search."}
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Member No</TableCell>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                                                {values.missingFields.includes("aadhaarNumber") && (
                                                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Aadhar</TableCell>
                                                )}
                                                {values.missingFields.includes("panNumber") && (
                                                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PAN Card</TableCell>
                                                )}
                                                {values.missingFields.includes("address") && (
                                                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Address</TableCell>
                                                )}
                                                {values.missingFields.includes("phone") && (
                                                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Phone</TableCell>
                                                )}
                                                {values.missingFields.includes("passportNumber") && (
                                                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Passport Number</TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredMembers.map((member, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                                    }}
                                                >
                                                    <TableCell sx={{ fontWeight: "bold" }}>{member.memberNo}</TableCell>
                                                    <TableCell>{member.name}</TableCell>

                                                    {values.missingFields.includes("aadhaarNumber") && (
                                                        <TableCell sx={{ color: !member.aadhaarNumber ? "red" : "inherit" }}>
                                                            {member.aadhaarNumber || "Missing"}
                                                        </TableCell>
                                                    )}
                                                    {values.missingFields.includes("panNumber") && (
                                                        <TableCell sx={{ color: !member.panNumber ? "red" : "inherit" }}>
                                                            {member.panNumber || "Missing"}
                                                        </TableCell>
                                                    )}
                                                    {values.missingFields.includes("address") && (
                                                        <TableCell sx={{ color: !member.address ? "red" : "inherit" }}>
                                                            {member.address || "Missing"}
                                                        </TableCell>
                                                    )}
                                                    {values.missingFields.includes("phone") && (
                                                        <TableCell sx={{ color: !member.phone ? "red" : "inherit" }}>
                                                            {member.phone || "Missing"}
                                                        </TableCell>
                                                    )}
                                                    {values.missingFields.includes("passportNumber") && (
                                                        <TableCell sx={{ color: !member.passportNumber ? "red" : "inherit" }}>
                                                            {member.passportNumber || "Missing"}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};

export default MissingMembersTable;