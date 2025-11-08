import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Stack,
    InputAdornment,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

export default function MemberDetailsPage() {
    const [members, setMembers] = useState([]);
    const [query, setQuery] = useState("");
    const [previewMember, setPreviewMember] = useState(null);

    useEffect(() => {
        const sample = [
            {
                memberNo: "M001",
                name: "Aarav Sharma",
                idType: "Aadhar",
                idValue: "1234-5678-9012",
                phone: "9876543210",
                address: "New Delhi",
            },
            {
                memberNo: "M002",
                name: "Riya Gupta",
                idType: "PAN",
                idValue: "ABCDE1234F",
                phone: "9123456789",
                address: "Mumbai",
            },
            {
                memberNo: "M003",
                name: "Karan Mehta",
                idType: "Aadhar",
                idValue: "3333-4444-5555",
                phone: "9988776655",
                address: "Bengaluru",
            },
        ];
        setMembers(sample);
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return members.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.memberNo.toLowerCase().includes(q) ||
                m.idType.toLowerCase().includes(q) ||
                m.idValue.toLowerCase().includes(q) ||
                m.phone.toLowerCase().includes(q)
        );
    }, [query, members]);

    const handlePrint = (member) => {
        const w = window.open("", "_blank", "width=800,height=900");
        w.document.write(`
      <html>
        <head>
          <title>${member.name} - Member Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td { padding: 10px; border: 1px solid #ccc; }
            .label { font-weight: bold; background-color: #f5f5f5; width: 30%; }
          </style>
        </head>
        <body>
          <h1>Member Details</h1>
          <table>
            <tr><td class="label">Member No</td><td>${member.memberNo}</td></tr>
            <tr><td class="label">Name</td><td>${member.name}</td></tr>
            <tr><td class="label">ID Type</td><td>${member.idType}</td></tr>
            <tr><td class="label">ID Value</td><td>${member.idValue}</td></tr>
            <tr><td class="label">Phone</td><td>${member.phone}</td></tr>
            <tr><td class="label">Address</td><td>${member.address}</td></tr>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
        w.document.close();
    };

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Member Details
            </Typography>

            <TextField
                placeholder="Search by name, ID, phone..."
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Member No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>ID Type</TableCell>
                            <TableCell>ID Value</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No members found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((m) => (
                                <TableRow key={m.memberNo}>
                                    <TableCell>{m.memberNo}</TableCell>
                                    <TableCell>{m.name}</TableCell>
                                    <TableCell>{m.idType}</TableCell>
                                    <TableCell>{m.idValue}</TableCell>
                                    <TableCell>{m.phone}</TableCell>
                                    <TableCell>{m.address}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" justifyContent="center">
                                            <IconButton color="primary" onClick={() => setPreviewMember(m)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handlePrint(m)}>
                                                <PrintIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!previewMember} onClose={() => setPreviewMember(null)} fullWidth maxWidth="sm">
                <DialogTitle>Member Preview</DialogTitle>
                <DialogContent>
                    {previewMember && (
                        <Box mt={1}>
                            <Typography><b>Member No:</b> {previewMember.memberNo}</Typography>
                            <Typography><b>Name:</b> {previewMember.name}</Typography>
                            <Typography><b>ID Type:</b> {previewMember.idType}</Typography>
                            <Typography><b>ID Value:</b> {previewMember.idValue}</Typography>
                            <Typography><b>Phone:</b> {previewMember.phone}</Typography>
                            <Typography><b>Address:</b> {previewMember.address}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewMember(null)}>Close</Button>
                    <Button
                        startIcon={<PrintIcon />}
                        variant="contained"
                        onClick={() => handlePrint(previewMember)}
                    >
                        Print
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}