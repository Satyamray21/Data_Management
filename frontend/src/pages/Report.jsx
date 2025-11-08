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
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Formik, Form } from "formik";

const MissingMembersTable = () => {
    const members = [
        {
            memberNo: "M001",
            name: "Aarav Sharma",
            aadhaarNumber: "1234-5678-9012",
            panNumber: "ABCDE1234F",
            address: "Delhi",
            phone: "9999999999",
        },
        {
            memberNo: "M002",
            name: "Riya Gupta",
            aadhaarNumber: "",
            panNumber: "",
            address: "",
            phone: "8888888888",
        },
        {
            memberNo: "M003",
            name: "Karan Mehta",
            aadhaarNumber: "5678-9012-3456",
            panNumber: "",
            address: "Mumbai",
            phone: "",
        },
        {
            memberNo: "M004",
            name: "Priya Singh",
            aadhaarNumber: "9876-5432-1000",
            panNumber: "XYZAB6789C",
            address: "Pune",
            phone: "7777777777",
        },
        {
            memberNo: "M005",
            name: "Rahul Verma",
            aadhaarNumber: "",
            panNumber: "",
            address: "Bangalore",
            phone: "6666666666",
        },
    ];

    const fieldLabels = {
        aadhaarNumber: "Aadhar Card",
        panNumber: "PAN Card",
        address: "Address",
        phone: "Phone Number",
    };

    // 📄 PDF Generator
    const generatePDF = (filteredMembers, visibleFields, viewType) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Members Details Report", 14, 15);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
        doc.text(`View Type: ${viewType}`, 14, 28);
        doc.text(`Total Members: ${filteredMembers.length}`, 14, 34);

        const tableHead = [
            "Member No",
            "Name",
            ...visibleFields.map((f) => fieldLabels[f]),
        ];

        const tableData = filteredMembers.map((m) => [
            m.memberNo,
            m.name,
            ...visibleFields.map((f) => m[f] || "Missing"),
        ]);

        autoTable(doc, {
            startY: 42,
            head: [tableHead],
            body: tableData,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [25, 118, 210], textColor: 255 },
        });

        doc.save(`Members_${viewType}_${Date.now()}.pdf`);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
            >
                Members Information Overview
            </Typography>

            <Formik
                initialValues={{
                    search: "",
                    viewType: "all",
                    showFields: [],
                }}
                onSubmit={() => { }}
            >
                {({ values, setFieldValue }) => {
                    const filteredMembers = useMemo(() => {
                        let result = members;
                        const dataFields = Object.keys(fieldLabels);

                        // ✅ Filter by missing or filled
                        if (values.viewType === "missing") {
                            result = members.filter((m) =>
                                dataFields.some((f) => !m[f]?.trim())
                            );
                        } else if (values.viewType === "filled") {
                            result = members.filter((m) =>
                                dataFields.every((f) => m[f]?.trim())
                            );
                        }

                        // ✅ Search filter
                        const q = values.search.toLowerCase().trim();
                        if (q) {
                            result = result.filter(
                                (m) =>
                                    m.name.toLowerCase().includes(q) ||
                                    m.memberNo.toLowerCase().includes(q)
                            );
                        }

                        return result;
                    }, [values.search, values.viewType]);

                    // ✅ FIXED: Show fields based on user selection or view type
                    const visibleFields = useMemo(() => {
                        // If user has selected specific fields, always respect that
                        if (values.showFields.length > 0) {
                            return values.showFields;
                        }

                        // If no fields selected, show appropriate fields based on view type
                        if (values.viewType === "missing") {
                            // For missing view, show all fields that have missing data in the entire dataset
                            return Object.keys(fieldLabels).filter((field) =>
                                members.some((m) => !m[field]?.trim())
                            );
                        } else {
                            // For "all" and "filled" views, show all fields
                            return Object.keys(fieldLabels);
                        }
                    }, [values.viewType, values.showFields]);

                    return (
                        <Form>
                            <Stack spacing={2} sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        alignItems: "center",
                                    }}
                                >
                                    {/* 🔍 Search */}
                                    <TextField
                                        variant="outlined"
                                        placeholder="Search by Member No or Name"
                                        size="small"
                                        value={values.search}
                                        onChange={(e) =>
                                            setFieldValue("search", e.target.value)
                                        }
                                        sx={{ width: "100%", maxWidth: 250 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {/* 🔄 View Type */}
                                    <FormControl size="small" sx={{ minWidth: 180 }}>
                                        <InputLabel>View Type</InputLabel>
                                        <Select
                                            value={values.viewType}
                                            onChange={(e) =>
                                                setFieldValue("viewType", e.target.value)
                                            }
                                        >
                                            <MenuItem value="all">All Members</MenuItem>
                                            <MenuItem value="missing">
                                                Missing Fields
                                            </MenuItem>
                                            <MenuItem value="filled">
                                                Filled Fields
                                            </MenuItem>
                                        </Select>
                                    </FormControl>

                                    {/* 🧾 Show Fields - NOW ENABLED in all views */}
                                    <FormControl
                                        size="small"
                                        sx={{ minWidth: 220 }}
                                    >
                                        <InputLabel>Show Fields</InputLabel>
                                        <Select
                                            multiple
                                            value={values.showFields}
                                            onChange={(e) =>
                                                setFieldValue("showFields", e.target.value)
                                            }
                                            renderValue={(selected) => (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {selected.map((value) => (
                                                        <Chip
                                                            key={value}
                                                            label={fieldLabels[value]}
                                                            size="small"
                                                        />
                                                    ))}
                                                    {selected.length === 0 && (
                                                        <Chip
                                                            label={
                                                                values.viewType === "missing"
                                                                    ? "Auto (Missing Fields)"
                                                                    : "All Fields"
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        >
                                            {Object.entries(fieldLabels).map(
                                                ([key, label]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {label}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>

                                    {/* 📄 PDF Download */}
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<PictureAsPdfIcon />}
                                        disabled={filteredMembers.length === 0}
                                        onClick={() =>
                                            generatePDF(
                                                filteredMembers,
                                                visibleFields,
                                                values.viewType
                                            )
                                        }
                                    >
                                        Download PDF
                                    </Button>
                                </Box>
                            </Stack>

                            {/* Summary */}
                            <Typography
                                variant="body2"
                                sx={{ mb: 2, color: "text.secondary" }}
                            >
                                Showing {filteredMembers.length} members ({values.viewType} view)
                                {values.viewType === "missing" && values.showFields.length === 0 &&
                                    ` - Showing ${visibleFields.length} fields with missing data`
                                }
                                {values.showFields.length > 0 &&
                                    ` - Showing ${values.showFields.length} selected fields`
                                }
                            </Typography>

                            {/* Table */}
                            {filteredMembers.length === 0 ? (
                                <Typography
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        textAlign: "center",
                                        color: "error.main",
                                    }}
                                >
                                    No members found matching your criteria.
                                </Typography>
                            ) : (
                                <TableContainer
                                    component={Paper}
                                    sx={{ borderRadius: 2, boxShadow: 3 }}
                                >
                                    <Table>
                                        <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                                                    Member No
                                                </TableCell>
                                                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                                                    Name
                                                </TableCell>
                                                {visibleFields.map((field) => (
                                                    <TableCell
                                                        key={field}
                                                        sx={{ color: "#fff", fontWeight: "bold" }}
                                                    >
                                                        {fieldLabels[field]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {filteredMembers.map((m, i) => (
                                                <TableRow
                                                    key={i}
                                                    sx={{
                                                        "&:nth-of-type(odd)": {
                                                            backgroundColor: "#fafafa",
                                                        },
                                                        "&:hover": {
                                                            backgroundColor: "#f5f5f5",
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={{ fontWeight: "bold" }}>
                                                        {m.memberNo}
                                                    </TableCell>
                                                    <TableCell>{m.name}</TableCell>
                                                    {visibleFields.map((field) => {
                                                        const isMissing = !m[field]?.trim();

                                                        // In missing view, only show data for fields that are actually missing
                                                        // In other views, show all data
                                                        const shouldShowData = values.viewType !== "missing" || isMissing;

                                                        return (
                                                            <TableCell
                                                                key={field}
                                                                sx={{
                                                                    color: isMissing ? "red" : "green",
                                                                    fontWeight: isMissing ? "bold" : "normal",
                                                                    backgroundColor: isMissing ? "#ffebee" :
                                                                        (values.viewType === "missing" ? "#f9f9f9" : "#e8f5e9"),
                                                                }}
                                                            >
                                                                {shouldShowData ? (m[field] || "Missing") : ""}
                                                            </TableCell>
                                                        );
                                                    })}
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